import { NextResponse } from 'next/server';

function getMonday(d: Date): string {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date.toISOString().split('T')[0];
}

export async function GET() {
  try {
    return NextResponse.json({
      id: 'local',
      name: 'My Weekly Dinner Plan',
      startDate: getMonday(new Date()),
      entries: [],
    });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json({ error: 'Failed to fetch meal plan' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ success: true });
}

export async function PUT() {
  return NextResponse.json({ success: true });
}
