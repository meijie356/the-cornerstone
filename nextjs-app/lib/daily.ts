import fs from 'fs';
import path from 'path';

interface DailyVerse {
  day: number;
  reference: string;
}

export function getVerseOfTheDay(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const filePath = path.join(process.cwd(), 'bible-ai/data/daily_verses.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const verses: DailyVerse[] = JSON.parse(fileContent);

  const verse = verses.find(v => v.day === dayOfYear);
  return verse ? verse.reference : "Psalm 23:1 (NIV)"; // Default fallback
}
