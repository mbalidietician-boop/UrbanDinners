'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useAppStore } from '@/store/useAppStore';

const navLinks = [
  { label: 'Home', section: 'home' },
  { label: "Tonight's Dinner", section: 'dinner' },
  { label: 'Fridge Search', section: 'fridge' },
  { label: 'Meal Planner', section: 'planner' },
  { label: 'Grocery List', section: 'grocery' },
  { label: 'About Mbali', section: 'about' },
] as const;

export default function AppHeader() {
  const { activeSection, setActiveSection, mobileNavOpen, setMobileNavOpen } =
    useAppStore();

  function handleNav(section: string) {
    setActiveSection(section);
    setMobileNavOpen(false);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LEFT: Brand */}
        <div className="flex flex-col justify-center">
          <button
            onClick={() => handleNav('home')}
            className="font-display font-bold text-lg sm:text-xl text-primary hover:opacity-80 transition-opacity text-left"
          >
            Urban Dinners
          </button>
          <span className="text-xs text-muted-foreground">
            by Mbali Mapholi, RD
          </span>
        </div>

        {/* CENTER: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => handleNav(link.section)}
              className={`text-sm transition-colors ${
                activeSection === link.section
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: Mobile menu button only */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-display font-bold text-primary text-lg">
              Urban Dinners
            </SheetTitle>
            <SheetDescription>by Mbali Mapholi, RD</SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col gap-1 px-4 mt-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => handleNav(link.section)}
                className={`text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeSection === link.section
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
