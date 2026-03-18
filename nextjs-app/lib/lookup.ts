import fs from 'fs/promises';
import path from 'path';

export async function lookupVerse(reference: string): Promise<string | null> {
    try {
        // Updated regex to handle "Book Chapter:Verse-Verse"
        const match = reference.match(/^(\d?\s?[A-Za-z\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
        if (!match) {
            console.log(`Failed to match reference: ${reference}`);
            return null;
        }

        let book = match[1].trim();
        const chapterNum = match[2];
        const startVerse = parseInt(match[3]);
        const endVerse = match[4] ? parseInt(match[4]) : startVerse;

        console.log(`Lookup: Book=${book}, Chapter=${chapterNum}, Range=${startVerse}-${endVerse}`);
        
        // Normalize "Psalm" to "Psalms"
        if (book.toLowerCase() === 'psalm') book = 'Psalms';
        
        // Path relative to root of project (one level up from nextjs-app)
        const nivDir = path.join(process.cwd(), '../data/niv');
        const files = await fs.readdir(nivDir);
        const bookFile = files.find(f => f.toLowerCase() === `${book.toLowerCase()}.json`);

        if (!bookFile) {
            console.log(`File not found for book: ${book}`);
            return null;
        }

        const data = await fs.readFile(path.join(nivDir, bookFile), 'utf-8');
        const json = JSON.parse(data);

        const chapter = json.chapters.find((c: any) => c.chapter === chapterNum);
        if (!chapter) {
            console.log(`Chapter ${chapterNum} not found in ${bookFile}`);
            return null;
        }

        const verses = [];
        for (let i = startVerse; i <= endVerse; i++) {
            const verseObj = chapter.verses.find((v: any) => parseInt(v.verse) === i);
            if (verseObj) {
                verses.push(verseObj.text);
            }
        }
        
        const result = verses.join(' ');
        console.log(`Returning result: ${result}`);
        return result.length > 0 ? result : null;

    } catch (e) {
        console.error("Lookup error:", e);
        return null;
    }
}
