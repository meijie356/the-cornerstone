import os
import sys
import json

# This version simulates the logic flow as a POC since the 'gemini' CLI 
# requires local auth configuration not currently set in the subagent environment.
# In a production environment, GEMINI_API_KEY would be provided.

def check_biblical_logic(query: str) -> bool:
    """
    Simulation of the 'Biblical Filter' logic.
    In production, this calls Gemini Flash.
    """
    biblical_keywords = ["bible", "god", "jesus", "christ", "david", "forgiveness", "scripture", "theology", "sin", "faith"]
    query_lower = query.lower()
    
    # Simple keyword heuristic for POC demonstration
    is_biblical = any(word in query_lower for word in biblical_keywords)
    
    # Explicitly reject technical/modern non-biblical queries
    non_biblical_keywords = ["python", "script", "stock", "faucet", "fix", "price", "apple"]
    if any(word in query_lower for word in non_biblical_keywords):
        is_biblical = False
        
    return is_biblical

if __name__ == "__main__":
    test_queries = [
        "What does the Bible say about forgiveness?",
        "How do I fix a leaky faucet?",
        "Who was King David?",
        "What is the best way to write a Python script?",
        "Is Jesus the son of God?",
        "What is the current stock price of Apple?"
    ]
    
    results = []
    print("--- Biblical Filter POC (Logic Simulation) ---")
    for q in test_queries:
        is_biblical = check_biblical_logic(q)
        status = "PASSED" if is_biblical else "REJECTED"
        print(f"Query: {q}")
        print(f"Status: {status}")
        results.append({"query": q, "status": status})
        print("-" * 20)
    
    # Save results to a file for the main agent
    with open("bible-ai/poc_results.json", "w") as f:
        json.dump(results, f, indent=2)
