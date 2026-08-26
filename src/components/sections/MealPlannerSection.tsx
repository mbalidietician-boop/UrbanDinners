'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, RefreshCw, Plus, ArrowLeftRight, Clock, Loader2, Printer, Share2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getMealIcon } from '@/lib/meal-images';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MealInfo {
  id: string;
  name: string;
  imageEmoji: string;
  totalTime: number;
  budget: string;
  servings: number;
  proteinType: string;
  tags: string;
}

interface MealPlanEntry {
  id: string;
  day: string;
  mealType: string;
  mealId: string | null;
  order: number;
  meal: MealInfo | null;
}

interface MealPlan {
  id: string;
  name: string;
  startDate: string;
  entries: MealPlanEntry[];
}

interface SlotDialog {
  open: boolean;
  day: string;
  mealType: string;
  entryId: string | null;
  currentMeal: MealInfo | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const MEAL_TYPES = ['dinner'] as const;

const MEAL_TYPE_LABELS: Record<string, string> = {
  dinner: 'Dinner',
};

function getTodayName(): string {
  const dayIndex = new Date().getDay();
  // JS getDay: 0=Sun, 1=Mon, ..., 6=Sat
  return DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
}

// ─── Component ───────────────────────────────────────────────────────────────

interface MealPlannerSectionProps {
  className?: string;
}

export default function MealPlannerSection({ className }: MealPlannerSectionProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const todayName = getTodayName();

  const [dialog, setDialog] = useState<SlotDialog>({
    open: false,
    day: '',
    mealType: '',
    entryId: null,
    currentMeal: null,
  });

  // ── Queries ──────────────────────────────────────────────────────────────

  const {
    data: plan,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<MealPlan>({
    queryKey: ['mealplan'],
    queryFn: async () => {
      const res = await fetch('/api/mealplans');
      if (!res.ok) throw new Error('Failed to fetch meal plan');
      return res.json();
    },
    staleTime: 10_000,
  });

  const { data: availableMeals, isLoading: isLoadingMeals } = useQuery<
    MealInfo[]
  >({
    queryKey: ['meals', 'category', dialog.mealType],
    queryFn: async () => {
      const res = await fetch(
        `/api/meals?category=${dialog.mealType}`,
      );
      if (!res.ok) throw new Error('Failed to fetch meals');
      return res.json();
    },
    enabled: dialog.open && dialog.mealType !== '',
    staleTime: 30_000,
  });

  // ── Mutations ────────────────────────────────────────────────────────────

  const swapMutation = useMutation({
    mutationFn: async ({
      entryId,
      newMealId,
    }: {
      entryId: string;
      newMealId: string;
    }) => {
      const res = await fetch('/api/mealplans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, newMealId }),
      });
      if (!res.ok) throw new Error('Failed to swap meal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplan'] });
      setDialog((prev) => ({ ...prev, open: false }));
      toast({
        title: 'Meal swapped!',
        description: 'Your meal plan has been updated.',
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'Could not swap the meal. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({
      planId,
      day,
      mealType,
      mealId,
      order,
    }: {
      planId: string;
      day: string;
      mealType: string;
      mealId: string;
      order: number;
    }) => {
      const res = await fetch('/api/mealplans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, day, mealType, mealId, order }),
      });
      if (!res.ok) throw new Error('Failed to add meal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplan'] });
      setDialog((prev) => ({ ...prev, open: false }));
      toast({
        title: 'Meal added!',
        description: 'Your meal plan has been updated.',
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'Could not add the meal. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // ── Derived data ─────────────────────────────────────────────────────────

  const entriesBySlot = useMemo(() => {
    const map = new Map<string, MealPlanEntry>();
    if (plan?.entries) {
      for (const entry of plan.entries) {
        const key = `${entry.day}-${entry.mealType}`;
        map.set(key, entry);
      }
    }
    return map;
  }, [plan]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleSlotClick(day: string, mealType: string) {
    const key = `${day}-${mealType}`;
    const entry = entriesBySlot.get(key);
    setDialog({
      open: true,
      day,
      mealType,
      entryId: entry?.id ?? null,
      currentMeal: entry?.meal ?? null,
    });
  }

  function handleSelectMeal(meal: MealInfo) {
    if (dialog.entryId && dialog.currentMeal) {
      // Swap existing
      swapMutation.mutate({ entryId: dialog.entryId, newMealId: meal.id });
    } else if (plan) {
      // Add new
      const order = MEAL_TYPES.indexOf(dialog.mealType as typeof MEAL_TYPES[number]);
      addMutation.mutate({
        planId: plan.id,
        day: dialog.day,
        mealType: dialog.mealType,
        mealId: meal.id,
        order,
      });
    }
  }

  const isMutating = swapMutation.isPending || addMutation.isPending;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section id="planner" className={cn('py-12 sm:py-16', className)} data-week-date={plan?.startDate ?? ''}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <CalendarDays className="size-5 text-primary" />
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                My Week
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">
              Organise your family&apos;s dinners for the week
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={cn('size-3.5', isFetching && 'animate-spin')}
              />
              Generate New Plan
            </Button>
            {!isLoading && !isError && plan && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    document.body.classList.add('printing-planner');
                    window.print();
                    setTimeout(() => document.body.classList.remove('printing-planner'), 500);
                  }}
                >
                  <Printer className="size-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    const lines = plan.entries
                      .filter((e) => e.meal)
                      .map((e) => `${e.day}: ${e.meal!.name} (${e.meal!.totalTime}min)`);
                    const text = [
                      '🍽 *My Weekly Dinner Plan*',
                      '',
                      ...lines,
                      '',
                      '💡 Urban Dinners by Registered Dietitian Mbali Mapholi',
                                            '',
                      'www.mbalimapholiinc.co.za',
                    ].join('\n');
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                >
                  <Share2 className="size-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Loading Skeletons ────────────────────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day) => (
              <div
                key={day}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="bg-primary/5 px-3 py-2">
                  <Skeleton className="h-4 w-16" />
                </div>
                {MEAL_TYPES.map((mt) => (
                  <div
                    key={mt}
                    className="border-b border-border/50 px-3 py-2.5 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-5 rounded" />
                      <Skeleton className="h-3.5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── Error State ──────────────────────────────────────────────── */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center">
            <CalendarDays className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Something went wrong loading your meal plan. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCw className="size-3.5" />
              Try again
            </Button>
          </div>
        )}

        {/* ── Day Columns Grid ─────────────────────────────────────────── */}
        {!isLoading && !isError && plan && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day) => {
              const isToday = day === todayName;

              return (
                <div
                  key={day}
                  className={cn(
                    'overflow-hidden rounded-lg border bg-card transition-shadow duration-200',
                    isToday
                      ? 'border-primary ring-2 ring-primary/20 shadow-md'
                      : 'border-border',
                  )}
                >
                  {/* Day Header */}
                  <div
                    className={cn(
                      'rounded-t-lg px-3 py-2',
                      isToday ? 'bg-primary/10' : 'bg-primary/5',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {day}
                      </span>
                      {isToday && (
                        <span className="flex size-2 rounded-full bg-primary" aria-label="Today" />
                      )}
                    </div>
                  </div>

                  {/* Meal Slots */}
                  {MEAL_TYPES.map((mealType) => {
                    const key = `${day}-${mealType}`;
                    const entry = entriesBySlot.get(key);
                    const hasMeal = !!entry?.meal;

                    return (
                      <button
                        key={mealType}
                        type="button"
                        onClick={() => handleSlotClick(day, mealType)}
                        className={cn(
                          'w-full border-b border-border/50 px-3 py-2.5 text-left transition-colors last:border-b-0',
                          'hover:bg-muted/30 cursor-pointer',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                        )}
                        aria-label={
                          hasMeal
                            ? `${MEAL_TYPE_LABELS[mealType]}: ${entry!.meal!.name}. Click to swap.`
                            : `Add ${mealType} for ${day}`
                        }
                      >
                        <div className="flex items-center gap-2">
                          {hasMeal ? (
                            <>
                          <span
                            className="shrink-0 text-base leading-none"
                            role="img"
                            aria-hidden="true"
                          >
                            {getMealIcon(entry!.meal!.name, entry!.meal!.proteinType, '').emoji}
                          </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium leading-tight truncate">
                                  {entry!.meal!.name}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <Clock className="size-2.5" />
                                  {entry!.meal!.totalTime}min
                                </p>
                              </div>
                              <ArrowLeftRight className="size-3 shrink-0 text-muted-foreground/50" />
                            </>
                          ) : (
                            <>
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground/60">
                                <Plus className="size-3" />
                              </span>
                              <span className="text-xs text-muted-foreground/70">
                                Add
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Plan Stats ───────────────────────────────────────────────── */}
        {!isLoading && !isError && plan && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="gap-1.5 font-normal">
              <CalendarDays className="size-3" />
              Week of {plan.startDate}
            </Badge>
            <Badge variant="secondary" className="gap-1.5 font-normal">
              {plan.entries.filter((e) => e.mealId).length} / 7 dinners planned
            </Badge>
          </div>
        )}
      </div>

      {/* ─── Swap / Add Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={dialog.open}
        onOpenChange={(open) =>
          setDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {dialog.currentMeal
                ? `Swap ${dialog.currentMeal.name}`
                : `Add ${MEAL_TYPE_LABELS[dialog.mealType]} for ${dialog.day}`}
            </DialogTitle>
            <DialogDescription>
              {dialog.currentMeal
                ? `Choose a different meal to replace ${dialog.currentMeal.name}.`
                : `Pick a ${MEAL_TYPE_LABELS[dialog.mealType]} for ${dialog.day}.`}
            </DialogDescription>
          </DialogHeader>

          {/* Loading meals */}
          {isLoadingMeals && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading meals…
            </div>
          )}

          {/* Meals list */}
          {!isLoadingMeals && availableMeals && (
            <ScrollArea className="max-h-72 pr-1">
              <div className="space-y-1">
                {availableMeals.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No meals available for this category.
                  </p>
                )}
                {availableMeals.map((meal) => {
                  const isCurrentMeal =
                    dialog.currentMeal?.id === meal.id;
                  const isSwapping =
                    isMutating &&
                    (swapMutation.variables?.newMealId === meal.id ||
                      addMutation.variables?.mealId === meal.id);

                  return (
                    <button
                      key={meal.id}
                      type="button"
                      disabled={isCurrentMeal || isMutating}
                      onClick={() => handleSelectMeal(meal)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isCurrentMeal && 'opacity-50 cursor-not-allowed',
                        !isCurrentMeal && !isMutating && 'cursor-pointer',
                      )}
                      aria-label={`Select ${meal.name}`}
                    >
                      <span
                        className="shrink-0 text-2xl leading-none"
                        role="img"
                        aria-hidden="true"
                      >
                        {getMealIcon(meal.name, meal.proteinType, meal.tags).emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight truncate">
                          {meal.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Clock className="size-3" />
                            {meal.totalTime}min
                          </span>
                          <span>Serves {meal.servings}</span>
                        </div>
                      </div>
                      {isCurrentMeal && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px]"
                        >
                          Current
                        </Badge>
                      )}
                      {isSwapping && (
                        <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}