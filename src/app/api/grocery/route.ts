import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ categories: {} });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
