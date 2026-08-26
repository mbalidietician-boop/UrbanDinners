'use client';

import HeroSection from '@/components/sections/HeroSection';
import DinnerPlannerSection from '@/components/sections/DinnerPlannerSection';
import FridgeSearchSection from '@/components/sections/FridgeSearchSection';
import MealPlannerSection from '@/components/sections/MealPlannerSection';
import GroceryListSection from '@/components/sections/GroceryListSection';
import RemindersSection from '@/components/sections/RemindersSection';
import PersonalisationSection from '@/components/sections/PersonalisationSection';
import PremiumSection from '@/components/sections/PremiumSection';
import AboutMbaliSection from '@/components/sections/AboutMbaliSection';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        <PremiumSection />
        <DinnerPlannerSection />
        <FridgeSearchSection />
        <MealPlannerSection />
        <GroceryListSection />
        <RemindersSection />
        <AboutMbaliSection />
        <PersonalisationSection />
      </main>
      <AppFooter />
    </div>
  );
}