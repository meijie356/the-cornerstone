# Bible AI Engineer - Current State & Next Steps

## Status Update (2026-03-14 19:55 EDT)
- **NIV Bible Dataset:** Successfully sourced. 66 books, 31,103 verses in JSON format located in `bible-ai/data/niv/`.
- **Next.js Scaffold:** Initialized using App Router, TypeScript, and Tailwind CSS in `bible-ai/nextjs-app/`.
- **Biblical Filter POC:** Logic simulation completed (`filter_poc.py`). Ready for integration with Gemini Flash API.
- **RAG Pipeline:** Logic for verse ingestion and indexing is underway (`bible-ai/scripts/ingest_bible.py`).

## Engineering Specs: Retrieval & Constraints
### 1. Two-Step Retrieval Strategy (HyDE-Style)
To ensure high accuracy and theological relevance, implementation MUST follow this two-step flow:
- **Step 1 (Theological Hypothesis):** Upon receiving a user query, the LLM (Gemini/Claude) first generates a "Theological Hypothesis" or identifies potential verses/themes based on its internal training. This serves as a "hallucinated" grounded draft.
- **Step 2 (NIV Vector Query):** The generated hypothesis is then used as the query vector to search the NIV vector store (RAG). This matches the AI's theological intent against actual, accurate NIV scripture.

### 2. Output & Response Schema (System Persona: "The Cornerstone")
All theological responses MUST return a strict JSON object with the following fields:
- `answer`: The concise, direct answer to the user's question.
- `reference`: The specific Bible verses cited (e.g., "John 3:16").
- `topic`: The core theological theme (e.g., "Salvation", "Grace").
- `explanation`: A brief, insightful theological commentary synthesizing the reference with the answer.

### 3. Output & Tier Constraints
The final answer provided to the user MUST be strictly limited based on their subscription tier:

- **Basic/Free Tier:**
    - **Scripture Output:** Hard constraint. MUST be strictly limited to exactly **3 consecutive verses** from the retrieved scripture.
    - **Synthesis:** Limited to citing/presenting these 3 verses.

- **Premium Tier:**
    - **Scripture Output:** Initial citation still prefers the 3-verse window for clarity, but AI explanations and theological synthesis are **NOT bound** by the 3-verse limit.
    - **Deep Insights:** Premium features can reference broader context, synthesize across multiple chapters, and provide deeper theological insight beyond the initial 3-verse retrieval window.

### 4. Implementation Logic (Hard Constraints)
1. **Tier Detection:** The retrieval and synthesis service MUST identify the user's tier before processing the final response.
2. **Basic Path Enforcement:** In the Basic response path, the logic must include a mandatory slice/truncation step that ensures no more than 3 consecutive verses are returned.
3. **Premium Path Expansion:** In the Premium path, the prompt to the synthesis LLM should explicitly allow for broader context and more detailed theological synthesis.

## Directory Structure
- `bible-ai/data/niv/`: Raw scripture data.
- `bible-ai/nextjs-app/`: Web application frontend/backend.
- `bible-ai/scripts/`: Data processing and ingestion utilities.
- `bible-ai/prd.md`: Project Requirements Document.

## Next Steps (Prioritized)
1. **Implement HyDE Retrieval Flow:** Update the RAG service to perform the two-step "Hypothesis -> Vector Search" logic.
2. **Enforce Tier-Based Constraints:** 
    - **Basic:** Implement hard slicing logic to select exactly 3 consecutive verses in the synthesis layer.
    - **Premium:** Update LLM prompts to allow for expanded theological synthesis and referencing broader context.
3. **Refine `ingest_bible.py`:** Ensure indexing supports efficient retrieval for consecutive verse windows and provides enough surrounding context for Premium synthesis.
4. **Integration Test:** Validate that user questions yield grounded NIV verses via the new HyDE-style flow.

## Communication & Reporting
- **Milestone Log:** You MUST log all milestone completions and technical blockers in `bible-ai/status.log`.
- **Status Checks:** Report progress to **Brian** (Orchestrator). Flag any theological ambiguities or configuration needs immediately.
