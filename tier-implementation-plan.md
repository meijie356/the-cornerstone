# Implementation Plan: Tier-Based Retrieval & Synthesis

## 1. Overview
Distinguish between Basic and Premium tiers to enforce scripture limits while allowing for deeper insights for paid users.

## 2. Logic Flow

### A. Basic/Free Tier Path
1. **Query:** User asks a question.
2. **Retrieval:** RAG finds the most relevant 3-verse window.
3. **Synthesis (Hard Constraint):**
   - The LLM is instructed to ONLY use those 3 verses.
   - Post-processing logic verifies that exactly 3 consecutive verses are present.
   - Any attempt by the LLM to provide broader context is stripped or prevented via system prompt.
4. **Output:** 3 verses + minimal citation.

### B. Premium Tier Path
1. **Query:** User asks a question.
2. **Retrieval:** RAG finds the primary 3-verse window BUT also retrieves surrounding context (e.g., +/- 10 verses or the whole chapter).
3. **Synthesis (Expanded):**
   - The LLM is instructed to provide a deep theological synthesis.
   - It can reference any part of the retrieved broader context.
   - There is NO verse count limit on the explanation or the supporting citations.
4. **Output:** Primary 3-verse citation + Deep AI Insight + Supporting references.

## 3. Implementation Tasks
- [ ] **Middleware/Service Layer:** Create a `TierService` to inject `USER_TIER` into the request context.
- [ ] **Prompt Engineering:**
  - Create `basic_synthesis_prompt.md`: Focus on 3-verse strictness.
  - Create `premium_synthesis_prompt.md`: Focus on depth, synthesis, and broader context.
- [ ] **Post-Processing (Basic):** Implement a regex-based or count-based validator to ensure the 3-verse limit is not exceeded in the free tier.
- [ ] **RAG Update:** Modify the vector search to return a "Context Window" for Premium users while keeping a "Strict Window" for Basic users.
