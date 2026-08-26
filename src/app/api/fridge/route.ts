import { NextRequest, NextResponse } from "next/server";
import { meals, type Ingredient } from "@/data/meals";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerms = query
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const results = meals
      .map((meal) => {
        let ingredients: Ingredient[];
        if (Array.isArray(meal.ingredients)) {
          ingredients = meal.ingredients as Ingredient[];
        } else {
          try {
            ingredients = JSON.parse(meal.ingredients) as Ingredient[];
          } catch {
            return null;
          }
        }

        const ingredientNames = ingredients.map((i) => i.name.toLowerCase());

        const matchedTerms: string[] = [];
        const matchedIngredients: string[] = [];

        for (const term of searchTerms) {
          for (const ingName of ingredientNames) {
            if (ingName.includes(term)) {
              matchedTerms.push(term);
              matchedIngredients.push(ingredients[ingredientNames.indexOf(ingName)].name);
              break;
            }
          }
        }

        if (matchedTerms.length === 0) return null;

        return {
          ...meal,
          matchedCount: matchedTerms.length,
          totalTerms: searchTerms.length,
          matchedIngredients,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.matchedCount ?? 0) - (a?.matchedCount ?? 0));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Fridge search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
