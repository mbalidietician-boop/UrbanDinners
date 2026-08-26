'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { Utensils, ClipboardList, ShoppingCart } from 'lucide-react';

const features = [
  {
    emoji: '\uD83C\uDF7D\uFE0F',
    title: 'Dinner Ideas',
    description: 'South African dinner recipes with pap, samp, rice & more',
    icon: Utensils,
  },
  {
    emoji: '\uD83D\uDCCB',
    title: 'Weekly Dinner Planner',
    description: 'Organise your family dinners for the whole week',
    icon: ClipboardList,
  },
  {
    emoji: '\uD83D\uDED2',
    title: 'Smart Grocery Lists',
    description: 'Auto-generated from your dinner plan',
    icon: ShoppingCart,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function HeroSection() {
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  function handleNav(section: string) {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Subtle warm gradient background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-12 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Tagline area */}
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center rounded-full bg-sage px-4 py-1.5 text-xs font-medium text-sage-foreground sm:text-sm"
          >
            By Registered Dietitian Mbali Mapholi <span className="italic">— author of Inkonjane</span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display max-w-3xl text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            {"Tired of asking yourself, "}
            <br className="hidden sm:inline" />
            {"'What\u0027s for dinner?'"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            43 dietitian-approved South African dinners including Mampara Week budget meals, so you never have to think about it again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="min-w-[200px] text-base"
              onClick={() => handleNav('dinner')}
            >
              Plan Tonight&apos;s Dinner
            </Button>
            <button
              onClick={() => handleNav('planner')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Browse Weekly Plans
            </button>
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="group relative overflow-hidden border-border/60 bg-card/80 py-0 shadow-none transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:p-6">
                  <span className="text-4xl sm:text-5xl" role="img" aria-label={feature.title}>
                    {feature.emoji}
                  </span>
                  <h3 className="font-medium text-sm sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}