import re
import glob

files = sorted(glob.glob("public/*.html") + glob.glob("public/blog/*.html"))

floating_card = []
flush_edge = []

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read()
    
    # Find the first nav with aria-label="Main"
    nav_pattern = r'<nav[^>]*aria-label="Main"[^>]*>'
    nav_match = re.search(nav_pattern, content)
    
    if not nav_match:
        continue
    
    nav_classes = nav_match.group()
    nav_start = nav_match.start()
    
    # Look backwards from the nav to find the containing section
    # Find the most recent <section before the nav
    section_pattern = r'<section[^>]*>'
    sections_before = list(re.finditer(section_pattern, content[:nav_start]))
    
    if not sections_before:
        continue
    
    last_section = sections_before[-1].group()
    
    filename = filepath.replace('public\\', '').replace('public/', '')
    
    # Determine style based on nav classes
    if 'rounded-t-none' in nav_classes:
        style = "FLUSH_EDGE"
        flush_edge.append((filename, last_section, nav_classes))
    elif 'rounded-2xl' in nav_classes and 'border border-white/10' in nav_classes:
        style = "FLOATING_CARD"
        floating_card.append((filename, last_section, nav_classes))

print("=" * 80)
print("FLOATING CARD STYLE (rounded-2xl + border border-white/10)")
print("=" * 80)
print("Total: {} files\n".format(len(floating_card)))
for filename, section, nav in sorted(floating_card):
    print(filename)

print("\n" + "=" * 80)
print("FLUSH/EDGE-TO-EDGE STYLE (rounded-t-none rounded-b-2xl, no border)")
print("=" * 80)
print("Total: {} files\n".format(len(flush_edge)))
for filename, section, nav in sorted(flush_edge):
    print(filename)

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print("Floating Card: {} files".format(len(floating_card)))
print("Flush/Edge-to-Edge: {} files".format(len(flush_edge)))
print("Total: {} files".format(len(floating_card) + len(flush_edge)))
