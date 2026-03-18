# The Cornerstone - Project Specs & PRD

## 1. Vision
A Scripture-Bound Advisory Engine that provides Gospel-centered answers based strictly on the NIV Bible. It establishes a "Cornerstone" of truth by refusing to answer questions outside its biblical scope.

## 2. Core Features
- **Strict Biblical Guardrail:** If a question is not answerable via scripture, the app returns a default "out-of-scope" response.
- **Context Control:** The app will answer using a window of **3 consecutive verses** to provide concise yet contextual answers.
- **Advanced Retrieval (HyDE-Style):** The system will use the LLM to generate a "Theological Hypothesis" or draft verses first, then use that draft to query the NIV vector store for the exact, grounded scripture.
- **NIV Primary:** The New International Version is the hard-coded source of truth.

## 3. Monetization & SaaS Model
- **Free Tier:**
    - Limited number of full RAG responses per day.
    - Basic verse citation (limited to **3 consecutive verses**).
- **Premium Tier:**
    - Unlimited (or high-cap) RAG responses.
    - Detailed AI explanations/synthesis of the theology (can expand beyond the 3-verse window for deeper insight).
    - "Favorites" / Personal Study Notes.

## 4. Technical Stack (Proposed)
- **Frontend/Backend:** Next.js (highly portable for web/PWA) or Swift/SwiftUI if moving straight to iOS.
- **Models:** 
    - **Filter Model:** Gemini Flash (fast/cheap) to determine if a question is "Biblical."
    - **Synthesis Model:** Claude 3.5 Sonnet or Gemini Pro (high reasoning) for the detailed theological explanation.
- **Vector DB:** `qmd` or Pinecone (if scaling).
- **Authentication:** Clerk or NextAuth (for login) or Apple ID (if iOS).
- **Subscription:** Stripe (for Web) or In-App Purchases (for iOS).

## 5. Roadmap
- **Phase 1 (MVP):** Simple web app with RAG + "Biblical Filter" + limited free queries.
- **Phase 2:** Login system + Favorites + Basic Premium tier.
- **Phase 3:** iOS App Store launch + Native Subscription.
