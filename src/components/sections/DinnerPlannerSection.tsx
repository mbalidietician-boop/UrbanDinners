'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Wallet,
  Users,
  Search,
  Leaf,
  PiggyBank,
  ArrowLeftRight,
  Heart,
  Flame,
  UtensilsCrossed,
  Package,
  Printer,
  Share2,
  WheatOff,
  MilkOff,
  Sprout,
  X,
  MessageCircle,
  Lock,
  Zap,
  Crown,
} from 'lucide-react';

import { getMealIcon } from '@/lib/meal-images';

import { useAppStore, type FilterState } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ---------- Types ----------

interface Ingredient {
  name: string;
  quantity: string;
  category: string;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fibre: number | null;
  budget: string;
  proteinType: string;
  difficulty: string;
  tags: string;
  imageEmoji: string;
  ingredients: string; // JSON
  instructions: string; // JSON
  nutritionTip: string | null;
  budgetTip: string | null;
  swapOption: string | null;
  familyAdjust: string | null;
  isPremium: boolean;
}

// ---------- Helpers ----------

function parseIngredients(json: string): Ingredient[] {
  try {
    return JSON.parse(json) as Ingredient[];
  } catch {
    return [];
  }
}

function parseInstructions(json: string): string[] {
  try {
    return JSON.parse(json) as string[];
  } catch {
    return [];
  }
}

function buildQueryParams(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.budget && filters.budget !== 'all') params.set('budget', filters.budget);
  if (filters.proteinType && filters.proteinType !== 'all')
    params.set('proteinType', filters.proteinType);
  if (filters.maxTime && filters.maxTime !== 'all') params.set('maxTime', filters.maxTime);
  if (filters.tag && filters.tag !== 'all') params.set('tag', filters.tag);
  if (filters.search) params.set('search', filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL || 'https://paystack.shop/pay/kd5jce61vn';

const budgetLabel = (b: string) => {
  const map: Record<string, string> = { low: 'Budget-friendly', medium: 'Moderate', high: 'Premium' };
  return map[b] ?? b;
};

// ---------- Dietary Filter Helpers ----------

const GLUTEN_KEYWORDS = ['flour', 'breadcrumbs', 'breadcrumb', 'pasta', 'spaghetti', 'macaroni', 'bread', 'burger rolls', 'burger roll', 'pita bread', 'wraps', 'tortilla', 'roti', 'noodles', 'cornflour', 'samp', 'maize meal', 'self-raising flour', 'pizza'];
const DAIRY_KEYWORDS = ['milk', 'cheese', 'butter', 'margarine', 'yoghurt', 'yogurt', 'cream', 'feta', 'cheddar', 'mozzarella', 'parmesan'];

function isGlutenFree(meal: Meal): boolean {
 const ings = parseIngredients(meal.ingredients);
 return !ings.some(i =>
   GLUTEN_KEYWORDS.some(kw => i.name.toLowerCase().includes(kw))
 );
}

function isDairyFree(meal: Meal): boolean {
 const ings = parseIngredients(meal.ingredients);
 return !ings.some(i =>
   DAIRY_KEYWORDS.some(kw => i.name.toLowerCase().includes(kw))
 );
}

function isVegetarian(meal: Meal): boolean {
 return meal.proteinType === 'vegetarian';
}

const PORK_KEYWORDS = ['pork', 'bacon', 'ham', 'sausage', 'wors', 'boerewors', 'chorizo', 'salami', 'pepperoni'];

function isHalaal(meal: Meal): boolean {
  if (meal.proteinType === 'pork') return false;
  if (PORK_KEYWORDS.some(kw => meal.name.toLowerCase().includes(kw))) return false;
  const ings = parseIngredients(meal.ingredients);
  return !ings.some(i =>
    PORK_KEYWORDS.some(kw => i.name.toLowerCase().includes(kw))
  );
}

type DietaryFilter = 'all' | 'vegetarian' | 'dairy-free' | 'gluten-free' | 'halaal';

const DIETARY_OPTIONS: { value: DietaryFilter; label: string; icon: typeof Sprout; emoji?: string; check: (m: Meal) => boolean }[] = [
  { value: 'vegetarian', label: 'Vegetarian', icon: Sprout, check: isVegetarian },
  { value: 'dairy-free', label: 'Dairy-Free', icon: MilkOff, check: isDairyFree },
  { value: 'gluten-free', label: 'Gluten-Free', icon: WheatOff, check: isGlutenFree },
  { value: 'halaal', label: 'Halaal', icon: Sprout, emoji: '\u267E\uFE0F', check: isHalaal },
];

// ---------- Meal Icon System ----------

// Emoji icon colours are handled by getMealIcon() from @/lib/meal-images

// ---------- Animation ----------

const gridItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

// ---------- Leftover Suggestions Sub-component ----------

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

function LeftoverSuggestions({
  meals,
  setSelectedMeal,
}: {
  meals: Meal[] | undefined;
  setSelectedMeal: (m: unknown) => void;
}) {
  const { data: plan } = useQuery({
    queryKey: ['mealplan'],
    queryFn: async () => {
      const res = await fetch('/api/mealplans');
      if (!res.ok) throw new Error('Failed');
      return res.json() as Promise<{
        entries: { day: string; mealType: string; meal: Meal | null }[];
      }>;
    },
    staleTime: 60_000,
  });

  const suggestions = useMemo(() => {
    if (!plan?.entries || !meals) return null;

    const today = new Date().getDay(); // 0=Sun
    const yesterdayIndex = (today - 1 + 7) % 7;
    const yesterdayKey = DAYS[yesterdayIndex];

    const yesterdayDinner = plan.entries.find(
      (e) => e.day === yesterdayKey && e.mealType === 'dinner' && e.meal
    );

    if (!yesterdayDinner?.meal) return null;

    const yesterdayIngs = new Set(
      parseIngredients(yesterdayDinner.meal.ingredients).map((i) =>
        i.name.toLowerCase().trim()
      )
    );

    if (yesterdayIngs.size === 0) return null;

    const scored = meals
      .filter((m) => m.id !== yesterdayDinner.meal!.id)
      .map((m) => {
        const ings = new Set(
          parseIngredients(m.ingredients).map((i) => i.name.toLowerCase().trim())
        );
        let shared = 0;
        for (const name of ings) {
          if (yesterdayIngs.has(name)) shared++;
        }
        return { meal: m, shared };
      })
      .filter((s) => s.shared > 0)
      .sort((a, b) => b.shared - a.shared)
      .slice(0, 3);

    return scored.length > 0 ? scored : null;
  }, [plan, meals]);

  if (!suggestions) return null;

  return (
    <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
      <div className="rounded-xl bg-warm p-5">
        <div className="mb-3 flex items-center gap-2">
          <Package className="size-5 text-warm-foreground" />
          <h3 className="text-sm font-semibold text-warm-foreground">
            Use yesterday&apos;s leftovers!
          </h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {suggestions.map(({ meal: m }) => {
            const ico = getMealIcon(m.name, m.proteinType, m.tags);
            return (
              <div
                key={m.id}
                className="flex flex-1 items-center gap-3 rounded-lg bg-white/80 p-3"
              >
                <span className="text-2xl" role="img" aria-label={m.name}>
                  {ico.emoji}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-tight">{m.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-fit text-xs"
                    onClick={() => setSelectedMeal(m)}
                  >
                    View Recipe
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Premium Paywall Gate ----------

function PremiumGate({ children }: { children: React.ReactNode }) {
  const isPremium = false;

  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-sm select-none pointer-events-none opacity-60">
        {children}
      </div>
      {/* Paywall Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg text-center max-w-xs mx-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="size-6 text-primary" />
          </div>
          <h4 className="font-display text-lg font-bold text-foreground">
            Unlock This Recipe
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get full ingredients, step-by-step instructions, nutrition info &amp; dietitian tips for all 43 recipes.
          </p>
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => window.open(CHECKOUT_URL, '_blank')}
          >
            <Zap className="size-4" />
            Get Premium — R199 / 3 months
          </Button>
          <p className="text-[10px] text-muted-foreground">
            Instant access via Paystack &middot; No recurring charges
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Component ----------

export default function DinnerPlannerSection() {
  const { filters, setFilters, selectedMeal, setSelectedMeal } = useAppStore();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [printMode, setPrintMode] = useState(false);

  // Fetch meals
  const { data: meals, isLoading, isError } = useQuery<Meal[]>({
    queryKey: ['meals', filters.budget, filters.proteinType, filters.maxTime, filters.tag, filters.search],
    queryFn: async () => {
      const res = await fetch(`/api/meals${buildQueryParams(filters)}`);
      if (!res.ok) throw new Error('Failed to fetch meals');
      return res.json();
    },
    staleTime: 30_000,
  });

  // Apply dietary filter client-side
  const filteredMeals = useMemo(() => {
    if (!meals) return meals;
    if (dietaryFilter === 'all') return meals;
    const opt = DIETARY_OPTIONS.find(o => o.value === dietaryFilter);
    return opt ? meals.filter(opt.check) : meals;
  }, [meals, dietaryFilter]);

  // Count how many meals match each dietary filter
  const dietaryCounts = useMemo(() => {
    if (!meals) return {};
    const counts: Record<string, number> = {};
    for (const opt of DIETARY_OPTIONS) {
      counts[opt.value] = meals.filter(opt.check).length;
    }
    return counts;
  }, [meals]);

  // Typed selected meal
  const meal = selectedMeal as Meal | null;

  // Reset checked ingredients when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedMeal(null);
      setCheckedIngredients(new Set());
    }
  };

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const ingredients = meal ? parseIngredients(meal.ingredients) : [];
  const instructions = meal ? parseInstructions(meal.instructions) : [];

  return (
    <section id="dinner" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Tonight&apos;s Urban Dinner
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Find the perfect South African dinner for your family — from traditional stews to Friday night fakeaways
          </p>
        </div>

        {/* Dietary Filter Chips */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Dietary:</span>
          <button
            onClick={() => setDietaryFilter('all')}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              dietaryFilter === 'all'
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground'
            }`}
          >
            All Meals
          </button>
          {DIETARY_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const active = dietaryFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setDietaryFilter(active ? 'all' : opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-terracotta bg-terracotta/10 text-terracotta'
                    : 'border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground'
                }`}
              >
                {opt.emoji ? (
                  <span className="text-sm leading-none">{opt.emoji}</span>
                ) : (
                  <Icon className="size-3.5" />
                )}
                {opt.label}
                <span className={`ml-0.5 text-[10px] ${active ? 'text-terracotta/70' : 'text-muted-foreground/60'}`}>
                  {dietaryCounts[opt.value] ?? 0}
                </span>
              </button>
            );
          })}
          {dietaryFilter !== 'all' && (
            <button
              onClick={() => setDietaryFilter('all')}
              className="ml-1 inline-flex items-center gap-1 rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear dietary filter"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="mb-8 flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          {/* Budget */}
          <Select
            value={filters.budget}
            onValueChange={(v) => setFilters({ budget: v })}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Protein */}
          <Select
            value={filters.proteinType}
            onValueChange={(v) => setFilters({ proteinType: v })}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Protein" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Proteins</SelectItem>
              <SelectItem value="chicken">Chicken</SelectItem>
              <SelectItem value="beef">Beef</SelectItem>
              <SelectItem value="fish">Fish</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
            </SelectContent>
          </Select>

          {/* Max Time */}
          <Select
            value={filters.maxTime}
            onValueChange={(v) => setFilters({ maxTime: v })}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Max Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Time</SelectItem>
              <SelectItem value="15">Under 15min</SelectItem>
              <SelectItem value="30">Under 30min</SelectItem>
              <SelectItem value="45">Under 45min</SelectItem>
            </SelectContent>
          </Select>

          {/* Fakeaway / Special */}
          <Select
            value={filters.tag}
            onValueChange={(v) => setFilters({ tag: v })}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meals</SelectItem>
              <SelectItem value="fakeaway">Fakeaway</SelectItem>
              <SelectItem value="traditional">Traditional SA</SelectItem>
              <SelectItem value="quick">Quick Meals</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="one-pot">One-Pot</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search meals..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="py-0 shadow-none">
                <CardContent className="flex flex-col items-center gap-3 p-5">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <UtensilsCrossed className="text-muted-foreground size-10" />
            <p className="text-sm text-muted-foreground">
              Something went wrong loading meals. Please try again.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredMeals && filteredMeals.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <UtensilsCrossed className="text-muted-foreground size-10" />
            <p className="font-medium">
              {dietaryFilter !== 'all' ? `No ${DIETARY_OPTIONS.find(o => o.value === dietaryFilter)?.label ?? ''} meals found` : 'No meals found'}
            </p>
            <p className="text-sm text-muted-foreground">
              {dietaryFilter !== 'all'
                ? 'Try a different dietary filter or adjust your other filters'
                : 'Try adjusting your filters or search term'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDietaryFilter('all');
                setFilters({ budget: 'all', proteinType: 'all', maxTime: 'all', tag: 'all', search: '' });
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Meals grid */}
        <AnimatePresence mode="wait">
          {!isLoading && !isError && filteredMeals && filteredMeals.length > 0 && (
            <motion.div
              key={`${filters.budget}-${filters.proteinType}-${filters.maxTime}-${filters.search}-${dietaryFilter}`}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredMeals.map((m, i) => (
                <motion.div
                  key={m.id}
                  custom={i}
                  variants={gridItemVariants}
                  layout
                >
                  <Card className="group h-full overflow-hidden border-border/60 py-0 shadow-none transition-shadow duration-200 hover:shadow-md">
                    <CardContent className="flex h-full flex-col items-center gap-3 p-5 text-center">
                      {/* Meal Emoji Icon */}
                      {(() => {
                        const ico = getMealIcon(m.name, m.proteinType, m.tags);
                        return (
                          <div className={`flex h-28 w-full items-center justify-center rounded-xl ${ico.bg} ring-1 ${ico.ring} transition-transform duration-300 group-hover:scale-[1.03]`}>
                            <span className="text-5xl leading-none drop-shadow-sm" role="img" aria-label={m.name}>
                              {ico.emoji}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Name */}
                      <h3 className="font-medium text-sm leading-snug sm:text-base">
                        {m.name}
                      </h3>

                      {/* Description */}
                      <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                        {m.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                        >
                          <Clock className="size-3" />
                          {m.totalTime}min
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                        >
                          <Wallet className="size-3" />
                          {budgetLabel(m.budget)}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                        >
                          <Users className="size-3" />
                          {m.servings}
                        </Badge>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-auto flex w-full gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setCheckedIngredients(new Set());
                            setSelectedMeal(m);
                          }}
                        >
                          View Recipe
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 gap-1.5"
                          onClick={() => {
                            const text = encodeURIComponent(
                            );
                            window.open(`https://wa.me/?text=${text}`, '_blank');
                          }}
                          aria-label={`Share ${m.name} on WhatsApp`}
                        >
                          <MessageCircle className="size-3.5 text-green-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Yesterday's Leftovers Suggestion ---------- */}
      <LeftoverSuggestions meals={meals} setSelectedMeal={setSelectedMeal} />

      {/* ---------- Recipe Dialog ---------- */}
      <Dialog open={!!meal && !printMode} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] sm:max-w-2xl lg:max-w-3xl">
          <ScrollArea className="max-h-[calc(90vh-2rem)] pr-3">
            {meal && (
              <>
                <DialogHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="font-display text-xl sm:text-2xl">
                      {meal.name}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Full recipe details for {meal.name}
                    </DialogDescription>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => {
                        document.body.classList.add('printing-recipe');
                        setPrintMode(true);
                        setTimeout(() => window.print(), 300);
                        setTimeout(() => {
                          document.body.classList.remove('printing-recipe');
                          setPrintMode(false);
                        }, 1000);
                      }}
                    >
                      <Printer className="size-3.5" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => {
                        const text = encodeURIComponent(
                        );
                        window.open(`https://wa.me/?text=${text}`, '_blank');
                      }}
                    >
                      <Share2 className="size-3.5" />
                      WhatsApp
                    </Button>
                  </div>
                </DialogHeader>

                {/* Emoji Icon & time badges */}
                <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
                  {(() => {
                    const ico = getMealIcon(meal.name, meal.proteinType, meal.tags);
                    return (
                      <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl ${ico.bg} ring-1 ${ico.ring}`}>
                        <span className="text-5xl leading-none" role="img" aria-label={meal.name}>
                          {ico.emoji}
                        </span>
                      </div>
                    );
                  })()}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      Prep: {meal.prepTime}min
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      Cook: {meal.cookTime}min
                    </Badge>
                    <Badge className="gap-1">
                      Total: {meal.totalTime}min
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="size-3" />
                      Serves {meal.servings}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-muted-foreground">
                  {meal.description}
                </p>

                <Separator className="my-4" />

                {/* Premium notice banner */}
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <Crown className="size-5 shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Full recipe is premium content
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ingredients, instructions, nutrition info, dietitian tips &amp; family adjustments require a Premium pass.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0 gap-1.5"
                    onClick={() => window.open(CHECKOUT_URL, '_blank')}
                  >
                    <Zap className="size-3.5" />
                    R199
                  </Button>
                </div>

                {/* Premium Content: Nutrition, Ingredients, Instructions, Tips */}
                <PremiumGate>
                {/* Nutrition grid */}
                {meal.calories != null && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Nutrition per serving</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: 'Energy', value: Math.round(meal.calories * 4.184), unit: 'kJ', icon: Flame },
                        { label: 'Protein', value: meal.protein, unit: 'g', icon: null },
                        { label: 'Carbs', value: meal.carbs, unit: 'g', icon: null },
                        { label: 'Fat', value: meal.fat, unit: 'g', icon: null },
                        { label: 'Fibre', value: meal.fibre, unit: 'g', icon: null },
                      ].map((n) => (
                        <div
                          key={n.label}
                          className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-2 text-center"
                        >
                          {n.icon && <n.icon className="size-4 text-primary" />}
                          <span className="text-xs text-muted-foreground">{n.label}</span>
                          <span className="text-sm font-semibold">
                            {n.value ?? '—'}{n.value != null ? n.unit : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Ingredients */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Ingredients
                    {ingredients.length > 0 && (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        ({ingredients.length} items)
                      </span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    {ingredients.map((ing) => (
                      <label
                        key={ing.name}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={checkedIngredients.has(ing.name)}
                          onCheckedChange={() => toggleIngredient(ing.name)}
                        />
                        <span
                          className={`flex-1 text-sm transition-all ${
                            checkedIngredients.has(ing.name)
                              ? 'text-muted-foreground line-through'
                              : ''
                          }`}
                        >
                          {ing.name}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {ing.quantity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Instructions */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Instructions</h4>
                  <ol className="space-y-3">
                    {instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {idx + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tip boxes */}
                <div className="mt-6 space-y-3">
                  {/* Dietitian tip */}
                  {meal.nutritionTip && (
                    <div className="flex gap-3 rounded-lg bg-sage/50 p-4">
                      <Leaf className="mt-0.5 size-4 shrink-0 text-accent" />
                      <div>
                        <p className="text-xs font-semibold text-sage-foreground">
                          Dietitian&apos;s Tip
                        </p>
                        <p className="mt-1 text-sm text-sage-foreground/90">
                          {meal.nutritionTip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Budget tip */}
                  {meal.budgetTip && (
                    <div className="flex gap-3 rounded-lg bg-warm p-4">
                      <PiggyBank className="mt-0.5 size-4 shrink-0 text-warm-foreground" />
                      <div>
                        <p className="text-xs font-semibold text-warm-foreground">
                          Budget Tip
                        </p>
                        <p className="mt-1 text-sm text-warm-foreground/90">
                          {meal.budgetTip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Swap option */}
                  {meal.swapOption && (
                    <div className="flex gap-3 rounded-lg bg-secondary p-4">
                      <ArrowLeftRight className="mt-0.5 size-4 shrink-0 text-secondary-foreground" />
                      <div>
                        <p className="text-xs font-semibold text-secondary-foreground">
                          Swap It
                        </p>
                        <p className="mt-1 text-sm text-secondary-foreground/90">
                          {meal.swapOption}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Family adjustment */}
                  {meal.familyAdjust && (
                    <div className="flex gap-3 rounded-lg bg-secondary p-4">
                      <Heart className="mt-0.5 size-4 shrink-0 text-secondary-foreground" />
                      <div>
                        <p className="text-xs font-semibold text-secondary-foreground">
                          Family-Friendly Adjustments
                        </p>
                        <p className="mt-1 text-sm text-secondary-foreground/90">
                          {meal.familyAdjust}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                </PremiumGate>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
}