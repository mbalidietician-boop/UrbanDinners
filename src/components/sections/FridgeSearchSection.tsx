'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CookingPot,
  Clock,
  Lock,
  UtensilsCrossed,
  Loader2,
  Sparkles,
  Crown,
  Zap,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getMealIcon } from '@/lib/meal-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL || 'https://paystack.shop/pay/kd5jce61vn';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FridgeMeal {
  id: string;
  name: string;
  imageEmoji: string;
  totalTime: number;
  budget: string;
  servings: number;
  matchedCount: number;
  totalTerms: number;
  matchedIngredients: string[];
  isPremium: boolean;
  proteinType: string;
  tags: string;
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Try: chicken, rice',
  'Try: mince, pap',
  'Try: spinach, tomatoes, onion',
  'Try: beans, maize meal',
];

// ─── Animation ───────────────────────────────────────────────────────────────

const gridItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function FridgeSearchSection() {
  const isPremium = false;
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      setSearchTerm(trimmed);
    }
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  // Fetch fridge search results
  const {
    data: meals,
    isLoading,
    isError,
  } = useQuery<FridgeMeal[]>({
    queryKey: ['fridge', searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `/api/fridge?q=${encodeURIComponent(searchTerm)}`,
      );
      if (!res.ok) throw new Error('Failed to search meals');
      return res.json();
    },
    enabled: isPremium && searchTerm.length > 0,
    staleTime: 30_000,
  });

  const hasSearched = searchTerm.length > 0;
  const hasResults = meals && meals.length > 0;

  // ── Inner content (used for both premium view and blurred background) ──
  const content = (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-8 text-center sm:mb-10">
        <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
          <CookingPot className="size-4 text-primary" />
          <span className="text-xs font-medium text-primary">
            Ingredient Search
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          What&apos;s in my Fridge?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Type what you have and we&apos;ll find a meal for you
        </p>
      </div>

      {/* ── Search Bar ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-10 max-w-2xl"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="e.g. chicken, rice, tomatoes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 h-11 text-sm"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={query.trim().length === 0 || isLoading}
            className="h-11 gap-2 px-5"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span className="sm:inline">Find Meals</span>
          </Button>
        </div>

        {/* Quick suggestion chips */}
        {!hasSearched && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {SUGGESTIONS.map((suggestion) => {
              const ingredient = suggestion.replace('Try: ', '');
              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(ingredient);
                    setSearchTerm(ingredient);
                  }}
                  className={cn(
                    'rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors',
                    'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
                  )}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Loading State ──────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="py-0 shadow-none">
              <CardContent className="flex flex-col items-center gap-3 p-5">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Error State ────────────────────────────────────────────────── */}
      {isError && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <UtensilsCrossed className="text-muted-foreground size-10" />
          <p className="text-sm text-muted-foreground">
            Something went wrong. Please try your search again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
          >
            Try again
          </Button>
        </motion.div>
      )}

      {/* ── No Results ─────────────────────────────────────────────────── */}
      {hasSearched && !isLoading && !isError && !hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-16 text-center"
        >
          <CookingPot className="text-muted-foreground size-10" />
          <p className="font-medium">No meals found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find any meals matching those ingredients. Try adding
            more common items like chicken, rice, or tomatoes.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery('');
              setSearchTerm('');
            }}
          >
            Clear search
          </Button>
        </motion.div>
      )}

      {/* ── Results Grid ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {hasSearched && !isLoading && !isError && hasResults && (
          <motion.div
            key={searchTerm}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {meals.map((meal, i) => {
              const matchPercent = Math.round(
                (meal.matchedCount / meal.totalTerms) * 100,
              );

              return (
                <motion.div
                  key={meal.id}
                  custom={i}
                  variants={gridItemVariants}
                  layout
                >
                  <Card
                    className={cn(
                      'group relative h-full overflow-hidden border-border/60 py-0 shadow-none transition-shadow duration-200 hover:shadow-md',
                      meal.isPremium && 'border-primary/30',
                    )}
                  >
                    <CardContent className="flex h-full flex-col items-center gap-3 p-5 text-center">
                      {/* Premium overlay */}
                      {meal.isPremium && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                          <Lock className="size-3 text-primary" />
                          <span className="text-[10px] font-semibold text-primary">
                            Premium
                          </span>
                        </div>
                      )}

                      {/* Emoji */}
                      {(() => {
                        const ico = getMealIcon(meal.name, meal.proteinType, meal.tags);
                        return (
                          <div className={cn(
                            'flex h-20 w-full items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                            ico.bg,
                            'ring-1',
                            ico.ring,
                            meal.isPremium && 'opacity-70 grayscale-[30%]',
                          )}>
                            <span className="text-4xl" role="img" aria-label={meal.name}>
                              {ico.emoji}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Name */}
                      <h3 className="font-medium text-sm leading-snug sm:text-base">
                        {meal.name}
                      </h3>

                      {/* Match info */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                        >
                          <Sparkles className="size-3" />
                          {meal.matchedCount}/{meal.totalTerms} matched
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                        >
                          <Clock className="size-3" />
                          {meal.totalTime}min
                        </Badge>
                      </div>

                      {/* Matched ingredients */}
                      {meal.matchedIngredients.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {meal.matchedIngredients.map((ing) => (
                            <Badge
                              key={ing}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Match strength bar */}
                      <div className="mt-auto w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            Match strength
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {matchPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              matchPercent >= 80
                                ? 'bg-green-500'
                                : matchPercent >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-orange-400',
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${matchPercent}%` }}
                            transition={{
                              delay: i * 0.06 + 0.3,
                              duration: 0.5,
                              ease: 'easeOut',
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Idle State (not yet searched) ──────────────────────────────── */}
      {!hasSearched && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-12">
            <CookingPot className="mx-auto mb-4 size-12 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              Your fridge is waiting to be explored
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Enter the ingredients you have on hand and we&apos;ll suggest
              meals you can make right now
            </p>
          </div>
        </motion.div>
      )}
    </>
  );

  // ── Paywall gate ──
  if (!isPremium) {
    return (
      <section id="fridge" className="scroll-mt-20 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative">
            <div className="blur-sm select-none pointer-events-none opacity-50">
              {content}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-lg text-center max-w-sm mx-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Crown className="size-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  What&apos;s in my Fridge?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type the ingredients you have on hand and we&apos;ll instantly find matching recipes from our collection. A Premium exclusive feature.
                </p>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => window.open(CHECKOUT_URL, '_blank')}
                >
                  <Zap className="size-4" />
                  Unlock — R199 / 3 months
                </Button>
                <p className="text-[10px] text-muted-foreground">
                  Instant access via Paystack &middot; No recurring charges
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Premium user sees full fridge search ──
  return (
    <section id="fridge" className="scroll-mt-20 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {content}
      </div>
    </section>
  );
}
