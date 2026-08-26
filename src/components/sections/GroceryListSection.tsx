'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  RefreshCw,
  Leaf,
  Check,
  Loader2,
  Share2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GroceryItem {
  name: string;
  quantity: string;
  checked: boolean;
  mealName: string;
}

interface GroceryData {
  planId: string;
  categories: Record<string, GroceryItem[]>;
}

// ─── Category Emojis ─────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  'Protein': { emoji: '\uD83E\uDD69', label: 'Protein' },
  'Fruit & Vegetables': { emoji: '\uD83E\uDD6C', label: 'Fruit & Vegetables' },
  'Pantry': { emoji: '\uD83C\uDFEA', label: 'Pantry' },
  'Dairy': { emoji: '\uD83E\uDD5B', label: 'Dairy' },
  'Frozen': { emoji: '\u2744\uFE0F', label: 'Frozen' },
  'Household': { emoji: '\uD83E\uDDF9', label: 'Household' },
};

const CATEGORY_ORDER = [
  'Protein',
  'Fruit & Vegetables',
  'Dairy',
  'Pantry',
  'Frozen',
  'Household',
];

const SHOPPING_TIPS = [
  'Buy seasonal vegetables for the best prices and freshest flavour.',
  'Frozen vegetables are just as nutritious as fresh and reduce food waste.',
  'Check what you already have in your kitchen before shopping.',
  'Buy in bulk for staples like rice, maize meal, and beans.',
];

// ─── Animation ───────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function GroceryListSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: groceryData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<GroceryData>({
    queryKey: ['grocery'],
    queryFn: async () => {
      const res = await fetch('/api/grocery');
      if (!res.ok) throw new Error('Failed to fetch grocery list');
      return res.json();
    },
    staleTime: 10_000,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      planId,
      name,
      quantity,
      category,
      checked,
    }: {
      planId: string;
      name: string;
      quantity: string;
      category: string;
      checked: boolean;
    }) => {
      const res = await fetch('/api/grocery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, name, quantity, category, checked }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grocery'] });
    },
  });

  // ── Derived stats ──────────────────────────────────────────────────────

  const allItems = groceryData
    ? Object.values(groceryData.categories).flat()
    : [];

  const totalItems = allItems.length;
  const checkedItems = allItems.filter((i) => i.checked).length;
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  // ── Handlers ───────────────────────────────────────────────────────────

  function handleToggle(
    category: string,
    item: GroceryItem,
  ) {
    if (!groceryData?.planId) return;
    toggleMutation.mutate({
      planId: groceryData.planId,
      name: item.name,
      quantity: item.quantity,
      category,
      checked: !item.checked,
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section id="grocery" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <ShoppingCart className="size-5 text-primary" />
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                My Grocery List
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">
              Auto-generated from your weekly meal plan
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="shrink-0"
          >
            <RefreshCw
              className={cn('size-3.5', isFetching && 'animate-spin')}
            />
            Refresh List
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!groceryData) return;
              const lines: string[] = ['🛒 *My Grocery List*', ''];
              for (const cat of CATEGORY_ORDER) {
                const items = groceryData.categories[cat];
                if (!items?.length) continue;
                const meta = CATEGORY_META[cat] || { emoji: '📦', label: cat };
                lines.push(`${meta.emoji} *${meta.label}*`);
                for (const item of items) {
                  lines.push(`  ${item.checked ? '✅' : '☐'} ${item.name} — ${item.quantity}`);
                }
                lines.push('');
              }
              lines.push('💡 Urban Dinners by Registered Dietitian Mbali Mapholi');
              lines.push('🇿🇦 Winter 2026 Collection');
              lines.push('');
              lines.push('www.mbalimapholiinc.co.za');
              window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
            }}
            disabled={!groceryData || isLoading}
            className="shrink-0 gap-1.5"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
        </div>

        {/* ── Progress ─────────────────────────────────────────────────── */}
        {!isLoading && groceryData && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border bg-card p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Shopping Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {checkedItems} of {totalItems} items purchased
              </span>
            </div>
            <Progress value={progressPercent} className="h-2.5" />
          </motion.div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="py-0 shadow-none">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="size-4 rounded" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────── */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-16 text-center">
            <ShoppingCart className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Could not load your grocery list. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {/* ── Grocery Categories ───────────────────────────────────────── */}
        {!isLoading && !isError && groceryData && (
          <div className="space-y-4">
            {CATEGORY_ORDER.filter((cat) => groceryData.categories[cat]?.length > 0).map(
              (category, catIndex) => {
                const items = groceryData.categories[category];
                const meta = CATEGORY_META[category] || {
                  emoji: '\uD83D\uDCE6',
                  label: category,
                };
                const catChecked = items.filter((i) => i.checked).length;

                return (
                  <motion.div
                    key={category}
                    custom={catIndex}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    <Card className="shadow-none">
                      <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <span className="text-xl" role="img" aria-label={meta.label}>
                            {meta.emoji}
                          </span>
                          {meta.label}
                          <span className="ml-auto text-xs font-normal text-muted-foreground">
                            {catChecked}/{items.length}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 sm:px-6">
                        <div className="space-y-0.5">
                          {items.map((item) => (
                            <label
                              key={item.name}
                              className={cn(
                                'flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30',
                              )}
                            >
                              <Checkbox
                                checked={item.checked}
                                onCheckedChange={() =>
                                  handleToggle(category, item)
                                }
                                disabled={toggleMutation.isPending}
                              />
                              <div className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    'text-sm transition-all',
                                    item.checked &&
                                      'line-through text-muted-foreground',
                                  )}
                                >
                                  {item.name}
                                </span>
                                {item.mealName && (
                                  <p className="text-[10px] text-muted-foreground/70 truncate">
                                    for {item.mealName}
                                  </p>
                                )}
                              </div>
                              <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                                {item.quantity}
                              </span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              },
            )}
          </div>
        )}

        {/* ── Shopping Tips ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="shadow-none border-accent/20 bg-sage/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Leaf className="mt-0.5 size-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold text-sm text-sage-foreground mb-3">
                    Smart Shopping Tips
                  </h3>
                  <ul className="space-y-2">
                    {SHOPPING_TIPS.map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2 text-sm text-sage-foreground/90"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}