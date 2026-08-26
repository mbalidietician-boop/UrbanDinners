'use client';

import { Instagram, Facebook, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';

const quickLinks = [
  { label: "Tonight's Dinner", section: 'dinner' },
  { label: 'Meal Planner', section: 'planner' },
  { label: 'Grocery List', section: 'grocery' },
  { label: 'Reminders', section: 'reminders' },
] as const;

export default function AppFooter() {
  const { setActiveSection } = useAppStore();

  function handleNav(section: string) {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <footer className="mt-auto bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* TOP: Three-column layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT: Branding */}
          <div className="md:w-1/3">
            <h2 className="font-display font-bold text-lg text-primary">
              Urban Dinners
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Created by Mbali Mapholi, Registered Dietitian
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Practical meal planning for busy South African families. Because
              healthy eating should be easy, affordable, and delicious.
            </p>
          </div>

          {/* CENTER: Quick Links */}
          <div className="md:w-1/3">
            <h3 className="text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => handleNav(link.section)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Connect */}
          <div className="md:w-1/3">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="mt-3 flex items-center gap-3">
              <button
                aria-label="Instagram"
                className="inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram className="size-4" />
              </button>
              <button
                aria-label="Facebook"
                className="inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Facebook className="size-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 shrink-0" />
              <span>info@minutritionza.co.za</span>
            </div>
          </div>
        </div>

        {/* SEPARATOR */}
        <Separator className="my-6 sm:my-8" />

        {/* DISCLAIMER */}
        <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Disclaimer
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            The information provided through Urban Dinners by
            Registered Dietitian Mbali Mapholi is intended for general nutrition
            education and meal-planning support. This platform does not replace
            personalised medical advice, diagnosis, or treatment from a
            healthcare professional. Individual nutrition needs vary depending on
            health status, medical conditions, age, activity levels, pregnancy
            status, allergies, medications, and personal circumstances. If you
            have a medical condition or specific dietary requirements, please
            consult with a registered healthcare professional or dietitian for
            personalised advice. Recipes and meal suggestions are designed to
            support balanced eating habits and should be adapted according to
            individual needs.
          </p>
        </div>

        {/* BOTTOM: Copyright */}
        <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>Made with care for South African families</p>
          <p>&copy; 2026 MiNutrition ZA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}