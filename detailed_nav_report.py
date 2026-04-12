import re
import glob

files = sorted(glob.glob("public/*.html") + glob.glob("public/blog/*.html"))

floating_card = {}
flush_edge = {}

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read()
    
    nav_pattern = r'<nav[^>]*aria-label="Main"[^>]*>'
    nav_match = re.search(nav_pattern, content)
    
    if not nav_match:
        continue
    
    nav_classes = nav_match.group()
    nav_start = nav_match.start()
    
    section_pattern = r'<section[^>]*>'
    sections_before = list(re.finditer(section_pattern, content[:nav_start]))
    
    if not sections_before:
        continue
    
    section_classes = sections_before[-1].group()
    filename = filepath.replace('public\\', '').replace('public/', '')
    
    if 'rounded-t-none' in nav_classes:
        flush_edge[filename] = {
            'section': section_classes,
            'nav': nav_classes
        }
    elif 'rounded-2xl' in nav_classes and 'border border-white/10' in nav_classes:
        floating_card[filename] = {
            'section': section_classes,
            'nav': nav_classes
        }

print("=" * 100)
print("FLOATING CARD STYLE (rounded-2xl + border border-white/10)")
print("=" * 100)
print("Total: {} files\n".format(len(floating_card)))
for filename in sorted(floating_card.keys()):
    print("File: {}".format(filename))
    section = floating_card[filename]['section']
    nav = floating_card[filename]['nav']
    
    # Extract padding from section
    section_padding = re.findall(r'(pt-\d+|sm:pt-\d+|px-\d+|sm:px-\d+|md:px-\d+|lg:px-\d+)', section)
    has_bg_black = 'bg-black' in section
    has_bg_white = 'bg-white' in section
    
    print("  Section classes: {}".format(section))
    print("  Nav classes: {}".format(nav))
    print()

print("\n" + "=" * 100)
print("FLUSH/EDGE-TO-EDGE STYLE (rounded-t-none rounded-b-2xl, no border)")
print("=" * 100)
print("Total: {} files\n".format(len(flush_edge)))
for filename in sorted(flush_edge.keys()):
    print("File: {}".format(filename))
    section = flush_edge[filename]['section']
    nav = flush_edge[filename]['nav']
    
    print("  Section classes: {}".format(section))
    print("  Nav classes: {}".format(nav))
    print()
