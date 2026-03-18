import os
import json
import glob

def ingest():
    data_dir = "bible-ai/data/niv"
    files = glob.glob(os.path.join(data_dir, "*.json"))
    
    total_verses = 0
    books_count = 0
    for f in files:
        try:
            with open(f, 'r') as jfile:
                data = json.load(jfile)
                if isinstance(data, dict):
                    book = data.get("book")
                    chapters = data.get("chapters", [])
                    for ch in chapters:
                        total_verses += len(ch.get("verses", []))
                    books_count += 1
        except Exception as e:
            print(f"Error reading {f}: {e}")
    
    print(f"Ingested {books_count} books.")
    print(f"Total verses indexed: {total_verses}")

if __name__ == "__main__":
    ingest()
