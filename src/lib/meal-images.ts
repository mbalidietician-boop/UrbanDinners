// Meal icon system — emojis with category-based warm colour backgrounds
// Replaces AI-generated photos for a clean, authentic look

export interface MealIconStyle {
  emoji: string;
  bg: string;       // tailwind bg class for the icon container
  ring: string;     // subtle ring/accent colour
}

// Colour palette based on meal type — warm African tones
const PROTEIN_STYLES: Record<string, MealIconStyle> = {
  chicken:  { emoji: "🍗", bg: "bg-amber-50",  ring: "ring-amber-200" },
  beef:     { emoji: "🥩", bg: "bg-red-50",     ring: "ring-red-200" },
  fish:     { emoji: "🐟", bg: "bg-sky-50",     ring: "ring-sky-200" },
  vegetarian: { emoji: "🥬", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  mixed:    { emoji: "🍽️", bg: "bg-orange-50",  ring: "ring-orange-200" },
};

// Specific emoji overrides — each meal gets the most accurate food emoji
const MEAL_EMOJI_OVERRIDES: Record<string, string> = {
  "Chicken Stew with Soft Pap":             "🍲",
  "Pap, Chakalaka & Wors":                  "🌶️",
  "Beef Stew with Phuthu":                  "🥘",
  "Samp & Beans with Chicken":              "🫘",
  "Canned Samp & Beans with Wors (Quick)":  "🍲",
  "Chicken Curry with Rice":                "🍛",
  "Mince & Rice":                           "🍖",
  "Fish Cakes with Mash & Veg":             "🐟",
  "Chicken & Sweet Potato Bake":            "🍠",
  "Lentil & Potato Curry (Dhal) with Rice": "🥣",
  "Bean & Vegetable Potjie with Rice":      "🫕",
  "Chicken & Vegetable Stir-fry with Rice": "🍳",
  "Roasted Chicken with Vegetables & Potatoes": "🍗",
  "Homemade Chicken Burgers":               "🍔",
  "Homemade Pizza Night":                   "🍕",
  "SA-Style Chicken Tikka (Fakeaway)":      "🍢",
  "Loaded Chicken Shawarma Wraps (Fakeaway)": "🌯",
  "Chicken & Dumplings (Dombolo)":          "🫓",
  "7 Colours Sunday Dinner":                "🍲",
  "Morogo with Tomatoes & Onions":          "🥬",
  "Sauteed Cabbage with Grated Carrots":    "🥕",
  "Bolognese Sauce with Pasta":             "🍝",
  "Sugar Beans (Ubhotshisi)":                 "🫘",
  "Canned Pilchards with Rice & Frozen Veggies": "🐟",
  "Chickpea & Spinach Curry":               "🥘",
  "Homemade Beef Burgers":                  "🍔",
  "Fish & Chips":                           "🍟",
  "Butternut & Chickpea Curry":             "🥘",
  "Chicken & Broccoli Stir-fry with Noodles":"🍜",
  "Sweetcorn & Spinach Fritters with Rice": "🌽",
  "Beef & Butternut Stew with Rice":        "🥘",
  "Chicken, Peas & Sweetcorn Rice Bowl":    "🍚",
  "Butternut, Spinach & Feta Bake":         "🥘",
  "Cabbage, Potato & Sausage Bake":         "🥘",
  "Lentil Bolognese Pasta (Vegetarian)":    "🍝",
  "Pilchard & Potato Curry":                  "🍛",
};

// Tag-based colour accents (for fakeaway, traditional, etc.)
const TAG_BG: Record<string, { bg: string; ring: string }> = {
  fakeaway:   { bg: "bg-violet-50",  ring: "ring-violet-200" },
  traditional: { bg: "bg-amber-50",  ring: "ring-amber-200" },
  "one-pot":  { bg: "bg-orange-50",  ring: "ring-orange-200" },
  budget:     { bg: "bg-lime-50",    ring: "ring-lime-200" },
  family:     { bg: "bg-rose-50",    ring: "ring-rose-200" },
  comfort:    { bg: "bg-yellow-50",  ring: "ring-yellow-200" },
};

export function getMealIcon(
  mealName: string,
  proteinType: string = "mixed",
  tags: string = ""
): MealIconStyle {
  // Get the specific emoji for this meal
  const emoji = MEAL_EMOJI_OVERRIDES[mealName] ?? PROTEIN_STYLES[proteinType]?.emoji ?? "🍽️";

  // Pick colour based on tags first, then protein type
  const tagList = tags.split(",");
  let style = PROTEIN_STYLES[proteinType] ?? PROTEIN_STYLES.mixed;

  for (const tag of tagList) {
    const trimmed = tag.trim();
    if (TAG_BG[trimmed]) {
      style = { emoji, ...TAG_BG[trimmed] };
      break;
    }
  }

  return style;
}