import re
import glob

files = glob.glob("public/*.html") + glob.glob("public/blog/*.html")
files.sort()

floating_card = []
flush_edge = []

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read()
    
    # Find the first section with bg-black and then look for nav aria-label="Main"
    section_pattern = r'<section[^>]*bg-black[^>]*>'
    nav_pattern = r'<nav[^>]*aria-label="Main"[^>]*>'
    
    section_match = re.search(section_pattern, content)
    if not section_match:
        continue
    
    # Look for nav after the section
    section_start = section_match.start()
    nav_match = re.search(nav_pattern, content[section_start:section_start+500])
    
    if not nav_match:
        continue
    
    section_classes = section_match.group()
    nav_classes = nav_match.group()
    
    # Determine style
    # Floating card: has generous padding (pt-3, pt-4, px-4, px-6, md:px-12, lg:px-24), rounded-2xl, border border-white/10
    # Flush/edge-to-edge: minimal padding (px-4 md:px-8), rounded-t-none rounded-b-2xl, no border
    
    filename = filepath.replace('public/', '')
    
    if 'rounded-t-none' in nav_classes:
        style = "FLUSH_EDGE"
        flush_edge.append((filename, section_classes, nav_classes))
    elif 'rounded-2xl' in nav_classes and 'border border-white/10' in nav_classes:
        style = "FLOATING_CARD"
        floating_card.append((filename, section_classes, nav_classes))
    else:
        style = "UNKNOWN"

print("=== FLOATING CARD STYLE ===")
print(f"Total: {len(floating_card)} files\n")
for filename, section, nav in floating_card:
    print(f"File: {filename}")
    print(f"  Section padding: ", end="")
    if "pt-3" in section or "pt-4" in section:
        print("generous (pt-3/pt-4, px-4/px-6, md:px-12/lg:px-24)", end="")
    else:
        print("minimal (px-4 md:px-8)", end="")
    print()
    print(f"  Nav style: rounded-2xl + border border-white/10")
    print()

print("\n=== FLUSH/EDGE-TO-EDGE STYLE ===")
print(f"Total: {len(flush_edge)} files\n")
for filename, section, nav in flush_edge:
    print(f"File: {filename}")
    print(f"  Section padding: minimal (px-4 md:px-8)")
    print(f"  Nav style: rounded-t-none rounded-b-2xl (no border)")
    print()
