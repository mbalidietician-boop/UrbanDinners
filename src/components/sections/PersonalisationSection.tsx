'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, type UserPreferences } from '@/store/useAppStore';
import {
  User,
  Users,
  Home,
  Heart,
  Target,
  Dumbbell,
  TrendingUp,
  Baby,
  Clock,
  Wallet,
  ChefHat,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const TOTAL_STEPS = 3;

const householdOptions = [
  {
    value: 'single' as const,
    label: 'Just me',
    description: 'Planning meals for one',
    icon: User,
  },
  {
    value: 'couple' as const,
    label: 'Me and my partner',
    description: 'Cooking for two',
    icon: Users,
  },
  {
    value: 'family' as const,
    label: 'My family',
    description: 'Meals for the whole household',
    icon: Home,
  },
];

const goalOptions = [
  {
    value: 'general' as const,
    label: 'General healthy eating',
    description: 'Balanced meals for everyday wellness',
    icon: Heart,
  },
  {
    value: 'weight-loss' as const,
    label: 'Weight management',
    description: 'Mindful portions, nourishing choices',
    icon: Target,
  },
  {
    value: 'high-protein' as const,
    label: 'High protein',
    description: 'Extra protein for active lifestyles',
    icon: Dumbbell,
  },
  {
    value: 'weight-gain' as const,
    label: 'Weight gain',
    description: 'Nutrient-dense meals to support healthy weight gain',
    icon: TrendingUp,
  },
  {
    value: 'family-nutrition' as const,
    label: 'Family nutrition',
    description: 'Balanced meals that the whole family will enjoy',
    icon: Baby,
  },
];

const lifestyleOptions = [
  {
    value: 'busy' as const,
    label: 'Busy schedule',
    description: 'Quick meals under 30 minutes',
    icon: Clock,
  },
  {
    value: 'limited-cooking' as const,
    label: 'Limited cooking time',
    description: 'Simple recipes with minimal prep',
    icon: ChefHat,
  },
  {
    value: 'budget-conscious' as const,
    label: 'Budget-conscious',
    description: 'Affordable meals that don\'t compromise nutrition',
    icon: Wallet,
  },
];

const stepHeadings = [
  'Tell us about your household',
  'What are your nutrition goals?',
  "What's your lifestyle?",
];

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const preferenceLabels: Record<string, string> = {
  single: 'Single',
  couple: 'Couple',
  family: 'Family',
  general: 'General healthy eating',
  'weight-loss': 'Weight management',
  'high-protein': 'High protein',
  'weight-gain': 'Weight gain',
  'family-nutrition': 'Family nutrition',
  busy: 'Busy schedule',
  'limited-cooking': 'Limited cooking',
  'budget-conscious': 'Budget-conscious',
};

export default function PersonalisationSection() {
  const { preferences, setPreferences, setActiveSection } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Local form state
  const [household, setHousehold] = useState<UserPreferences['household']>(preferences.household);
  const [numberOfPeople, setNumberOfPeople] = useState(preferences.numberOfPeople);
  const [hasChildren, setHasChildren] = useState(preferences.hasChildren);
  const [goal, setGoal] = useState<UserPreferences['goal']>(preferences.goal);
  const [selectedLifestyles, setSelectedLifestyles] = useState<UserPreferences['lifestyle'][]>(
    [preferences.lifestyle]
  );

  const toggleLifestyle = (value: UserPreferences['lifestyle']) => {
    setSelectedLifestyles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleDone = () => {
    setPreferences({
      household,
      numberOfPeople,
      hasChildren,
      goal,
      lifestyle: selectedLifestyles[0] || 'busy',
      onboardingComplete: true,
    });
    setShowSuccess(true);
  };

  const handleUpdatePreferences = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setHousehold(preferences.household);
    setNumberOfPeople(preferences.numberOfPeople);
    setHasChildren(preferences.hasChildren);
    setGoal(preferences.goal);
    setSelectedLifestyles([preferences.lifestyle]);
  };

  const handleStartPlanning = () => {
    setActiveSection('dinner');
  };

  return (
    <section id="personalise" className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {preferences.onboardingComplete && !showSuccess ? (
            /* ── Summary Card ── */
            <motion.div
              key="summary"
              variants={successVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="overflow-hidden border-border/60">
                <CardHeader className="items-center text-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-sage">
                    <Sparkles className="h-6 w-6 text-sage-foreground" />
                  </div>
                  <CardTitle className="font-display text-xl sm:text-2xl">
                    Your Preferences
                  </CardTitle>
                  <CardDescription className="mt-1 max-w-sm">
                    Your meal suggestions are now personalised for your household!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                      <User className="h-3.5 w-3.5" />
                      {preferenceLabels[preferences.household]}
                    </Badge>
                    {preferences.household === 'family' && (
                      <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                        <Users className="h-3.5 w-3.5" />
                        {preferences.numberOfPeople} {preferences.numberOfPeople === 1 ? 'person' : 'people'}
                      </Badge>
                    )}
                    {preferences.hasChildren && (
                      <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                        <Baby className="h-3.5 w-3.5" />
                        Has children
                      </Badge>
                    )}
                    <Badge className="gap-1.5 bg-sage px-3 py-1.5 text-sm text-sage-foreground hover:bg-sage">
                      <Target className="h-3.5 w-3.5" />
                      {preferenceLabels[preferences.goal]}
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {preferenceLabels[preferences.lifestyle]}
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <Button variant="outline" onClick={handleUpdatePreferences}>
                      Update Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : showSuccess ? (
            /* ── Success State ── */
            <motion.div
              key="success"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <Card className="overflow-hidden border-accent/40 bg-accent/5">
                <CardContent className="flex flex-col items-center gap-5 pt-8 pb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent"
                  >
                    <Check className="h-8 w-8 text-accent-foreground" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="font-display text-xl font-bold sm:text-2xl">
                      You&apos;re all set!
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      Your meal suggestions are now personalised for your household.
                    </p>
                  </div>
                  <Button size="lg" className="min-w-[200px]" onClick={handleStartPlanning}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Planning
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* ── Multi-step Form ── */
            <motion.div
              key={`step-${currentStep}`}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card className="overflow-hidden border-border/60">
                <CardHeader className="pb-2">
                  {/* Step indicators */}
                  <div className="mb-4 flex items-center justify-center gap-2">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => {
                          // Only allow clicking completed steps or the next step
                          if (step <= currentStep) setCurrentStep(step);
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                          step === currentStep
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : step < currentStep
                              ? 'bg-accent text-accent-foreground cursor-pointer'
                              : 'bg-muted text-muted-foreground cursor-default'
                        }`}
                        aria-label={`Step ${step}`}
                      >
                        {step < currentStep ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          step
                        )}
                      </button>
                    ))}
                  </div>

                  <CardTitle className="text-center font-display text-lg sm:text-xl">
                    {stepHeadings[currentStep - 1]}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <p className="text-center text-sm text-muted-foreground">
                          Who are you planning meals for?
                        </p>

                        <RadioGroup
                          value={household}
                          onValueChange={(v) => setHousehold(v as UserPreferences['household'])}
                          className="gap-3"
                        >
                          {householdOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = household === option.value;
                            return (
                              <Label
                                key={option.value}
                                htmlFor={`household-${option.value}`}
                                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                }`}
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`household-${option.value}`}
                                  className="sr-only"
                                />
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  } transition-colors`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-semibold">{option.label}</span>
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {option.description}
                                  </span>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  >
                                    <Check className="h-5 w-5 text-primary" />
                                  </motion.div>
                                )}
                              </Label>
                            );
                          })}
                        </RadioGroup>

                        {/* Family details */}
                        <AnimatePresence>
                          {household === 'family' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="num-people" className="text-sm font-medium">
                                    How many people?
                                  </Label>
                                  <div className="flex items-center gap-3">
                                    <Input
                                      id="num-people"
                                      type="number"
                                      min={1}
                                      max={10}
                                      value={numberOfPeople}
                                      onChange={(e) => {
                                        const val = Math.min(10, Math.max(1, Number(e.target.value) || 1));
                                        setNumberOfPeople(val);
                                      }}
                                      className="h-10 w-20 text-center"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      people in your household
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    id="has-children"
                                    checked={hasChildren}
                                    onCheckedChange={(checked) => setHasChildren(checked === true)}
                                  />
                                  <Label
                                    htmlFor="has-children"
                                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                                  >
                                    <Baby className="h-4 w-4 text-muted-foreground" />
                                    I have children
                                  </Label>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <p className="text-center text-sm text-muted-foreground">
                          Choose the goal that best describes you
                        </p>

                        <RadioGroup
                          value={goal}
                          onValueChange={(v) => setGoal(v as UserPreferences['goal'])}
                          className="gap-3"
                        >
                          {goalOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = goal === option.value;
                            return (
                              <Label
                                key={option.value}
                                htmlFor={`goal-${option.value}`}
                                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                }`}
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`goal-${option.value}`}
                                  className="sr-only"
                                />
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  } transition-colors`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-semibold">{option.label}</span>
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {option.description}
                                  </span>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  >
                                    <Check className="h-5 w-5 text-primary" />
                                  </motion.div>
                                )}
                              </Label>
                            );
                          })}
                        </RadioGroup>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <p className="text-center text-sm text-muted-foreground">
                          Select all that apply to you
                        </p>

                        <div className="grid gap-3">
                          {lifestyleOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedLifestyles.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => toggleLifestyle(option.value)}
                                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                }`}
                              >
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-semibold">{option.label}</span>
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {option.description}
                                  </span>
                                </div>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleLifestyle(option.value)}
                                  className="pointer-events-none"
                                  aria-label={option.label}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="gap-1.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    {currentStep < TOTAL_STEPS ? (
                      <Button size="sm" onClick={handleNext} className="gap-1.5">
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleDone} className="gap-1.5">
                        Done
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}