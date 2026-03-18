import { NextResponse } from 'next/server';
import { getVerseOfTheDay } from '../../../lib/daily';

export async function GET() {
  try {
    const verse = getVerseOfTheDay();
    return NextResponse.json({ reference: verse });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch verse of the day' }, { status: 500 });
  }
}
