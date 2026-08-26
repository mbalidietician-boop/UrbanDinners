import { NextRequest, NextResponse } from 'next/server';
import { meals } from '@/data/meals';
import type { Ingredient } from '@/data/meals';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const budget = searchParams.get('budget');
    const proteinType = searchParams.get('proteinType');
    const category = searchParams.get('category');
    const maxTime = searchParams.get('maxTime');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const isPremium = searchParams.get('isPremium');

    let filtered = [...meals];

    if (budget && budget !== 'all') {
      filtered = filtered.filter((m) => m.budget === budget);
    }
    if (proteinType && proteinType !== 'all') {
      filtered = filtered.filter((m) => m.proteinType === proteinType);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((m) => m.category === category);
    }
    if (maxTime) {
      filtered = filtered.filter((m) => m.totalTime <= parseInt(maxTime));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(s));
    }
    if (tag && tag !== 'all') {
      filtered = filtered.filter((m) => m.tags.includes(tag));
    }
    if (isPremium !== null && isPremium !== undefined) {
      filtered = filtered.filter((m) => (m.isPremium ?? false) === (isPremium === 'true'));
    }

    // Transform to match frontend expectations (ingredients/instructions as JSON strings)
    const result = filtered.map((m) => ({
      ...m,
      ingredients: typeof m.ingredients === 'string' ? m.ingredients : JSON.stringify(m.ingredients),
      instructions: typeof m.instructions === 'string' ? m.instructions : JSON.stringify(m.instructions),
      isPremium: false,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
  }
}
