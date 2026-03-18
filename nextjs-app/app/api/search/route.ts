import { GoogleGenerativeAI } from "@google/generative-ai";
import { lookupVerse } from "../../../lib/lookup";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 1. Biblical Filter Logic
    const filterPrompt = `Determine if the following user query relates to life struggles, ethics, relationships, personal well-being, or spiritual questions that can be addressed by biblical wisdom.
    Respond with ONLY 'YES' or 'NO'.
    Query: "${query}"`;
    
    const filterResult = await model.generateContent(filterPrompt);
    const isBiblical = filterResult.response.text().trim().toUpperCase() === 'YES';

    if (!isBiblical) {
      return Response.json({ 
        answer: "This question is outside the biblical scope of The Cornerstone.",
        status: "rejected"
      });
    }

    // 2. Wise Pastor Response Generation
    const pastorPrompt = `You are a "Wise Pastor." Address the user's query with compassion and wisdom.
    Provide the response in a JSON format (raw JSON only) with these specific fields:
    - "answer": A brief, impactful pastoral response (max 2-3 sentences).
    - "reference": A single, specific Bible verse reference (e.g., "John 3:16").
    - "topic": A single word summarizing the topic.
    - "prayer": A short, heartfelt prayer related to the user's struggle.

    User Question: "${query}"`;

    const pastorResult = await model.generateContent(pastorPrompt);
    const jsonText = pastorResult.response.text().trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(jsonText);

    // 3. Lookup the exact verse text
    const verseText = await lookupVerse(data.reference);
    
    // 4. Combine and return
    return Response.json({
      ...data,
      verseText: verseText || "Could not retrieve verse text."
    });

  } catch (error: any) {
    console.error("Search API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
