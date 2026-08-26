import { create } from 'zustand';

export interface UserPreferences {
  household: 'single' | 'couple' | 'family';
  goal: 'general' | 'weight-loss' | 'high-protein' | 'weight-gain' | 'family-nutrition';
  lifestyle: 'busy' | 'limited-cooking' | 'budget-conscious';
  numberOfPeople: number;
  hasChildren: boolean;
  onboardingComplete: boolean;
}

export interface FilterState {
  budget: string;
  proteinType: string;
  maxTime: string;
  category: string;
  tag: string;
  search: string;
}

interface AppState {
  // Active section
  activeSection: string;
  setActiveSection: (section: string) => void;

  // User preferences
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Selected meal for detail view
  selectedMeal: unknown | null;
  setSelectedMeal: (meal: unknown | null) => void;

  // Reminder settings
  reminderSettings: {
    defrostEnabled: boolean;
    groceryEnabled: boolean;
    mealPrepEnabled: boolean;
    leftoverEnabled: boolean;
    reminderTime: string;
  };
  setReminderSettings: (settings: Partial<AppState['reminderSettings']>) => void;

  // Mobile nav
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const defaultFilters: FilterState = {
  budget: 'all',
  proteinType: 'all',
  maxTime: '',
  category: 'all',
  tag: 'all',
  search: '',
};

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section, mobileNavOpen: false }),

  preferences: {
    household: 'family',
    goal: 'family-nutrition',
    lifestyle: 'busy',
    numberOfPeople: 4,
    hasChildren: true,
    onboardingComplete: false,
  },
  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),

  filters: { ...defaultFilters },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectedMeal: null,
  setSelectedMeal: (meal) => set({ selectedMeal: meal }),

  reminderSettings: {
    defrostEnabled: true,
    groceryEnabled: true,
    mealPrepEnabled: false,
    leftoverEnabled: false,
    reminderTime: '17:00',
  },
  setReminderSettings: (settings) =>
    set((state) => ({
      reminderSettings: { ...state.reminderSettings, ...settings },
    })),

  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));