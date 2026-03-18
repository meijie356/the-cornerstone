import os
import json
import glob

def convert_json_to_markdown():
    input_dir = "bible-ai/data/niv"
    output_dir = "bible-ai/data/markdown"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    json_files = glob.glob(os.path.join(input_dir, "*.json"))
    
    total_verses = 0
    for f in json_files:
        if os.path.basename(f) == "Books.json":
            continue
            
        try:
            with open(f, 'r') as jfile:
                data = json.load(jfile)
                book = data.get("book")
                if not book:
                    continue
                
                md_content = f"# {book}\n\n"
                chapters = data.get("chapters", [])
                for ch in chapters:
                    chapter_num = ch.get("chapter")
                    md_content += f"## Chapter {chapter_num}\n\n"
                    verses = ch.get("verses", [])
                    for v in verses:
                        verse_num = v.get("verse")
                        text = v.get("text")
                        # Format: [Book Chapter:Verse] Text
                        md_content += f"**{book} {chapter_num}:{verse_num}** {text}\n\n"
                        total_verses += 1
                
                output_file = os.path.join(output_dir, f"{book}.md")
                with open(output_file, 'w') as mdfile:
                    mdfile.write(md_content)
        except Exception as e:
            print(f"Error processing {f}: {e}")
            
    print(f"Conversion complete. Total verses: {total_verses}")

if __name__ == "__main__":
    convert_json_to_markdown()
