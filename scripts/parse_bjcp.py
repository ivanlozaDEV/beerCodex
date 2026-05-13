import os
import re
import json
import sys
from docx import Document

def sanitize(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_numeric(text, pattern):
    # Replace comma decimal separator with dot for float conversion
    clean = text.replace("–", "-").replace("—", "-").replace(",", ".")
    match = re.search(pattern, clean, re.IGNORECASE)
    if match:
        try:
            v1 = float(match.group(1))
            v2 = float(match.group(2))
            return {"min": min(v1, v2), "max": max(v1, v2)}
        except:
            pass
    return {"min": None, "max": None}

def parse_stats(text):
    # Normalized raw string for debugging
    raw = sanitize(text)
    # Regexes for extracting numeric values (min, max)
    pat_og = r'(?:OG|D\.?I\.?|D\.?O\.?|Densidad\s+Original)\s*:\s*([0-9.]+)\s*(?:-|–)\s*([0-9.]+)'
    pat_fg = r'(?:FG|D\.?F\.?|Densidad\s+Final)\s*:\s*([0-9.]+)\s*(?:-|–)\s*([0-9.]+)'
    pat_ibu = r'(?:IBUs?)\s*:\s*([0-9.]+)\s*(?:-|–)\s*([0-9.]+)'
    pat_srm = r'(?:SRM)\s*:\s*([0-9.]+)\s*(?:-|–)\s*([0-9.]+)'
    pat_abv = r'(?:ABV|G\.?A\.?|Graduaci\S+n\s+Alcoh\S+lica)\s*:\s*([0-9.,]+)\s*%?\s*(?:-|–)\s*([0-9.,]+)\s*%?'
    
    return {
        "og": {**extract_numeric(raw, pat_og), "raw": raw},
        "fg": {**extract_numeric(raw, pat_fg), "raw": raw},
        "ibu": {**extract_numeric(raw, pat_ibu), "raw": raw},
        "srm": {**extract_numeric(raw, pat_srm), "raw": raw},
        "abv": {**extract_numeric(raw, pat_abv), "raw": raw},
    }

def parse_doc(file_path, lang="en"):
    print(f"--- Parsing document: {file_path} ({lang}) ---")
    doc = Document(file_path)
    
    # Setup standard schema keys
    if lang == "es":
        key_map = {
            "impresión general": "overall_impression",
            "aroma": "aroma",
            "apariencia": "appearance",
            "aspecto": "appearance",
            "sabor": "flavor",
            "sensación en boca": "mouthfeel",
            "comentarios": "comments",
            "historia": "history",
            "ingredientes característicos": "ingredients",
            "ingredientes": "ingredients",
            "comparación de estilos": "comparison",
            "instrucciones para la inscripción": "entry_instructions",
            "estadísticas vitales": "vital_statistics",
            "ejemplos comerciales": "commercial_examples",
            "etiquetas": "tags"
        }
        trigger_start = "STANDARD AMERICAN BEER"
        trigger_stop = "APÉNDICE A"
    else:
        key_map = {
            "overall impression": "overall_impression",
            "aroma": "aroma",
            "appearance": "appearance",
            "flavor": "flavor",
            "mouthfeel": "mouthfeel",
            "comments": "comments",
            "history": "history",
            "characteristic ingredients": "ingredients",
            "style comparison": "comparison",
            "entry instructions": "entry_instructions",
            "vital statistics": "vital_statistics",
            "commercial examples": "commercial_examples",
            "tags": "tags"
        }
        trigger_start = "STANDARD AMERICAN BEER"
        trigger_stop = "APPENDIX A"
        
    # Generate sorting key regex for finding prefixes in line
    regex_parts = sorted(key_map.keys(), key=len, reverse=True)
    prefix_regex = re.compile(r'\b(' + "|".join(map(re.escape, regex_parts)) + r')\s*:', re.IGNORECASE)
    
    styles = []
    started = False
    
    current_category = "Unknown"
    current_category_id = "0"
    current_style = None
    current_field = None
    
    parent_style_code = None # Tracks most recent Heading 3 code (e.g., 21B for Specialty IPA)
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
            
        style_name = para.style.name
        
        # Check triggers
        if not started:
            if "Heading 2" in style_name and trigger_start.lower() in text.lower():
                started = True
                print("Detected START trigger:", text)
            else:
                continue
                
        if started and "Heading 2" in style_name and trigger_stop.lower() in text.lower():
            print("Detected STOP trigger:", text)
            break
            
        # Handle Hierarchy
        if "Heading 2" in style_name:
            # New Category
            current_category = sanitize(text)
            
            # Reset parent style code on new category
            parent_style_code = None
            
            # Special hardcoded ID for historical beers which have no 27A, 27B styles
            if "historical beer" in current_category.lower() or "cerveza histórica" in current_category.lower():
                current_category_id = "27"
                parent_style_code = "27"
            elif "introduction" in current_category.lower() or "introducción" in current_category.lower():
                # This is an intro category, ignore it or keep previous category_id
                pass
                
            print(f"-> Found Category: {current_category} (Assigned ID: {current_category_id})")
            continue
            
        # Handle regular style (Heading 3)
        # Pattern matches code + title e.g. "1A. American Light Lager"
        heading3_match = re.match(r"^([0-9X]+[A-Z]?)\.\s+(.+)$", text)
        if "Heading 3" in style_name and heading3_match:
            # Complete previous style
            if current_style:
                styles.append(current_style)
            
            style_id = heading3_match.group(1)
            style_name_text = heading3_match.group(2)
            
            # Extract category number from ID
            cat_id_match = re.match(r"^([0-9]+)", style_id)
            if cat_id_match:
                current_category_id = cat_id_match.group(1)
            elif "X" in style_id:
                current_category_id = "X" # Appendix B
            
            parent_style_code = style_id
            
            print(f"   [Style] {style_id}: {style_name_text}")
            
            current_style = {
                "id": style_id,
                "name": sanitize(style_name_text),
                "category_id": current_category_id,
                "category_name": current_category,
                "overall_impression": "",
                "aroma": "",
                "appearance": "",
                "flavor": "",
                "mouthfeel": "",
                "comments": "",
                "history": "",
                "ingredients": "",
                "comparison": "",
                "entry_instructions": "",
                "vital_statistics": None,
                "commercial_examples": [],
                "tags": []
            }
            current_field = None
            continue
            
        # Handle nested styles (Heading 5, like Specialty IPA: Belgian IPA)
        if "Heading 5" in style_name and ":" in text:
            # Look if it's a known prefix
            # Example: "Specialty IPA: Belgian IPA"
            parts = text.split(":", 1)
            prefix = parts[0].strip().lower()
            
            ignore_words = ["vital", "comercial", "commercial", "classific", "clasific", "tag", "etiqueta"]
            should_ignore = any(word in prefix for word in ignore_words)
            
            if not should_ignore and len(parts) > 1:
                sub_name = parts[1].strip()
                # Ensure subname actually has content and isn't blank
                if len(sub_name) > 2:
                    if current_style:
                        styles.append(current_style)
                        
                    # Generate safe slug
                    sub_slug = re.sub(r'[^a-z0-9]', '-', sub_name.lower()).strip('-')
                    
                    # Fallback if parent_style_code is missing (e.g., Historical Beer)
                    base_code = parent_style_code or current_category_id
                    derived_id = f"{base_code}-{sub_slug}"
                    
                    print(f"   [Sub-Style] {derived_id}: {sub_name}")
                    
                    current_style = {
                        "id": derived_id,
                        "name": sanitize(sub_name),
                        "category_id": current_category_id,
                        "category_name": current_category,
                        "overall_impression": "",
                        "aroma": "",
                        "appearance": "",
                        "flavor": "",
                        "mouthfeel": "",
                        "comments": "",
                        "history": "",
                        "ingredients": "",
                        "comparison": "",
                        "entry_instructions": "",
                        "vital_statistics": None,
                        "commercial_examples": [],
                        "tags": []
                    }
                    current_field = None
                    continue

        # Handle regular field content
        if current_style is not None:
            # Check if the paragraph contains labels
            # We use re.split to find labels, e.g. "Aroma: Blah blah Sabor: Blah blah"
            parts = prefix_regex.split(text)
            
            # If no labels matched, prefix_regex.split returns [text]
            if len(parts) == 1:
                # No key found, append to active field if any
                if current_field:
                    current_style[current_field] += " " + text
            else:
                # Iterating through segments
                # parts looks like ['', 'label1', 'content1', 'label2', 'content2']
                # The first part might be content belonging to the PREVIOUS field!
                first_content = parts[0].strip()
                if first_content and current_field:
                    current_style[current_field] += " " + first_content
                    
                # Now handle pairs
                for i in range(1, len(parts), 2):
                    label = parts[i].lower()
                    content = parts[i+1].strip() if (i+1) < len(parts) else ""
                    
                    # Map field
                    field_key = key_map.get(label)
                    if field_key:
                        current_field = field_key
                        # Set content
                        current_style[current_field] = content

    # Append last
    if current_style:
        styles.append(current_style)
        
    # Post process fields (Stats, comma parsing, strip spaces)
    for s in styles:
        # Handle numeric parsing for Stats
        # If we stored raw text in vital_statistics, parse it!
        raw_stats = s.get("vital_statistics")
        if isinstance(raw_stats, str) and raw_stats.strip():
            s["vital_statistics"] = parse_stats(raw_stats)
        else:
            s["vital_statistics"] = {
                "og": {"min": None, "max": None, "raw": ""},
                "fg": {"min": None, "max": None, "raw": ""},
                "ibu": {"min": None, "max": None, "raw": ""},
                "srm": {"min": None, "max": None, "raw": ""},
                "abv": {"min": None, "max": None, "raw": ""},
            }
            
        # Handle commercial examples string array
        raw_comm = s.get("commercial_examples")
        if isinstance(raw_comm, str) and raw_comm.strip():
            # Split by comma, but ignore semicolons used as separators for groups
            examples = [sanitize(e) for e in re.split(r'[;,]', raw_comm) if e.strip()]
            s["commercial_examples"] = examples
            
        # Handle tags string array
        raw_tags = s.get("tags")
        if isinstance(raw_tags, str) and raw_tags.strip():
            tags = [sanitize(t).lower() for t in re.split(r'[;,]', raw_tags) if t.strip()]
            s["tags"] = tags
            
        # Clean all texts
        for k in ["overall_impression", "aroma", "appearance", "flavor", "mouthfeel", "comments", "history", "ingredients", "comparison", "entry_instructions"]:
            s[k] = sanitize(s.get(k, ""))
            
    return styles

if __name__ == "__main__":
    # Define paths
    root = "/Users/ivanloza/Documents/BJCP"
    es_docx = os.path.join(root, "2021_Guidelines_Beer_ES_1.0.docx")
    en_docx = os.path.join(root, "2021_Guidelines_Beer_1.25.docx")
    
    out_dir = os.path.join(root, "src", "data")
    os.makedirs(out_dir, exist_ok=True)
    
    # Run ES
    es_styles = parse_doc(es_docx, lang="es")
    es_out = os.path.join(out_dir, "styles_es.json")
    with open(es_out, "w", encoding="utf-8") as f:
        json.dump(es_styles, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(es_styles)} styles to {es_out}")
    
    # Run EN
    en_styles = parse_doc(en_docx, lang="en")
    en_out = os.path.join(out_dir, "styles_en.json")
    with open(en_out, "w", encoding="utf-8") as f:
        json.dump(en_styles, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(en_styles)} styles to {en_out}")
    
    print("\n=== SCRIPT COMPLETED SUCCESSFULLY ===")
