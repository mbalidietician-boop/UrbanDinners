'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Crown,
  Star,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL || 'https://paystack.shop/pay/kd5jce61vn';

const FREE_TIER = {
  name: 'Free',
  price: 'R0',
  period: 'forever',
  description: 'Browse meals and get inspired — plan tonight\'s dinner.',
  features: [
    { text: 'Browse all 43 South African dinner recipes', included: true },
    { text: 'View meal names, descriptions & cooking times', included: true },
    { text: 'Filter by budget, protein, cook time & dietary needs', included: true },
    { text: 'WhatsApp recipe sharing', included: true },
    { text: 'Printable recipe cards', included: true },
    { text: 'Weekly dinner meal planning', included: true },
    { text: 'Auto-generated smart grocery lists', included: true },
    { text: 'See full ingredients & cooking instructions', included: false },
    { text: 'View nutrition info (kJ, protein, carbs, etc.)', included: false },
    { text: 'Read dietitian tips & budget tips', included: false },
    { text: '"What\'s in my fridge?" ingredient search', included: false },
    { text: 'WhatsApp dinner reminders', included: false },
    { text: 'Seasonal recipe rotations', included: false },
    { text: 'Printable grocery lists', included: false },
  ],
  cta: 'Current Plan',
  highlight: false,
};

const PREMIUM_TIER = {
  name: 'Premium',
  price: 'R199',
  period: '3 months',
  monthlyNote: 'Just R66/month — less than a take-away coffee',
  description: 'Unlock everything — full recipes, meal plans, grocery lists & dietitian tips.',
  seasonNote: '43 dietitian-approved South African dinner recipes',
  features: [
    { text: 'Browse all 43 South African dinner recipes', included: true },
    { text: 'View meal names, descriptions & cooking times', included: true },
    { text: 'Filter by budget, protein, cook time & dietary needs', included: true },
    { text: 'WhatsApp recipe sharing', included: true },
    { text: 'Printable recipe cards', included: true },
    { text: 'Weekly dinner meal planning', included: true },
    { text: 'Auto-generated smart grocery lists', included: true },
    { text: 'Full ingredients & step-by-step instructions', included: true },
    { text: 'Nutrition info per serving (kJ, protein, carbs)', included: true },
    { text: 'Dietitian tips, budget tips & swap suggestions', included: true },
    { text: '"What\'s in my fridge?" ingredient search', included: true },
    { text: 'WhatsApp dinner reminders', included: true },
    { text: 'Seasonal recipe rotations every 3 months', included: true },
    { text: 'Printable grocery lists', included: true },
  ],
  cta: 'Get Premium — R199 / 3 months',
  highlight: true,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

function PricingCard({ tier }: { tier: typeof FREE_TIER }) {
  const isPremium = tier.highlight;

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`relative h-full ${
          isPremium
            ? 'border-2 border-primary shadow-lg'
            : 'border-border/60'
        }`}
      >
        {isPremium && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="gap-1 bg-primary px-3 py-1 text-primary-foreground shadow-sm">
              <Sparkles className="h-3 w-3" />
              43 SA Dinners
            </Badge>
          </div>
        )}

        <CardHeader className={isPremium ? 'pt-7' : ''}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {isPremium && <Crown className="h-5 w-5 text-primary" />}
              {tier.name} Plan
            </CardTitle>
            <Badge variant="secondary">{tier.period}</Badge>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{tier.price}</span>
              {isPremium && (
                <span className="text-sm text-muted-foreground">/ 3 months</span>
              )}
            </div>
            {isPremium && (
              <p className="mt-1 text-xs text-muted-foreground">
                {tier.monthlyNote}
              </p>
            )}
            {isPremium && tier.seasonNote && (
              <p className="mt-1 text-xs font-medium text-primary/80">
                {tier.seasonNote}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {tier.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <ul className="space-y-2.5">
            {tier.features.map((feature) => (
              <li
                key={feature.text}
                className="flex items-start gap-2.5"
              >
                {feature.included ? (
                  isPremium ? (
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  ) : (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )
                ) : (
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                )}
                <span
                  className={`text-sm ${
                    feature.included
                      ? ''
                      : 'text-muted-foreground/60 line-through'
                  }`}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {isPremium ? (
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => {
                window.open(CHECKOUT_URL, '_blank');
              }}
            >
              <Zap className="h-4 w-4" />
              {tier.cta}
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="w-full"
              aria-disabled
            >
              {tier.cta}
            </Button>
          )}

          {isPremium && (
            <p className="text-center text-xs text-muted-foreground">
              Pay securely via Paystack. Instant access after payment.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PremiumSection() {
  return (
    <section id="premium" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Pricing Plan
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            43 dietitian-approved South African dinner recipes — plan, cook, and enjoy with your family.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            New recipes added regularly. No recurring subscriptions — buy one pass at a time.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <PricingCard tier={FREE_TIER} />
          <PricingCard tier={PREMIUM_TIER} />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-12"
        >
          <div className="rounded-xl bg-warm p-6 text-center">
            <h3 className="font-display text-lg font-bold sm:text-xl">
              Invest in your family&apos;s health — one dinner at a time.
            </h3>
            <p className="mt-2 text-sm text-warm-foreground/80 sm:text-base">
              Join South African families already planning smarter dinners with Urban Dinners.
            </p>
            <Button
              className="mt-5 gap-2"
              size="lg"
              onClick={() => {
                window.open(CHECKOUT_URL, '_blank');
              }}
            >
              <Sparkles className="h-4 w-4" />
              Get Premium — R199 / 3 months
            </Button>
            <p className="mt-3 text-xs text-warm-foreground/60">
              3 months access &middot; Pay securely via Paystack &middot; Instant access after payment
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}