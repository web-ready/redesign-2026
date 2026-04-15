"""Precisely verify which 'unused' CSS classes actually appear in HTML class attributes."""
import re, glob, os

targets = {
    # Group A candidates
    'transform', 'opacity-100', 'opacity-20',
    '-rotate-45', 'rotate-45', 'fixed',
    'overflow-y-auto', 'top-0', 'top-1', 'top-[17px]', 'top-[9px]',
    # Group B - all confirmed "not found" by agent, spot-check a few
    'md:text-7xl', 'sm:pt-20', 'lg:text-4xl',
    # Group C
    'h-10', 'text-7xl', 'leading-[0.92]', 'max-w-[8.5ch]',
    'min-h-[320px]', 'shadow-2xl', 'mb-0', 'pb-2', 'pt-5',
    'bg-[#f8f8f4]', 'bg-black/60', 'w-px', 'z-[200]',
    'gap-24', 'leading-[0.98]', 'translate-y-[8px]', '-translate-y-[8px]',
}

found = {t: set() for t in targets}

html_files = glob.glob('c:/Users/Gabriel/Documents/GitHub/redesign-2026/public/*.html')
for fpath in html_files:
    fname = os.path.basename(fpath)
    content = open(fpath, encoding='utf-8').read()
    for m in re.finditer(r'class=["\']([^"\']+)["\']', content):
        classes = set(m.group(1).split())
        for t in targets:
            if t in classes:
                found[t].add(fname)

# Also check JS files
js_files = glob.glob('c:/Users/Gabriel/Documents/GitHub/redesign-2026/public/js/*.js')
js_found = {t: set() for t in targets}
for fpath in js_files:
    fname = os.path.basename(fpath)
    content = open(fpath, encoding='utf-8').read()
    for t in targets:
        # Look for the class name in string literals
        pattern = re.compile(r"['\"]([^'\"]*\b" + re.escape(t) + r"\b[^'\"]*)['\"]")
        if pattern.search(content):
            js_found[t].add(fname)

print("=== PRECISE CLASS USAGE AUDIT ===")
print()
used = []
unused = []
for t in sorted(targets):
    html_uses = sorted(found[t])
    js_uses = sorted(js_found[t])
    if html_uses or js_uses:
        used.append((t, html_uses, js_uses))
    else:
        unused.append(t)

print(f"GENUINELY USED ({len(used)} classes):")
for t, html_uses, js_uses in used:
    locs = []
    if html_uses:
        locs.append(f"HTML: {html_uses[:3]}{'...' if len(html_uses)>3 else ''}")
    if js_uses:
        locs.append(f"JS: {js_uses}")
    print(f"  {t} -> {' | '.join(locs)}")

print()
print(f"CONFIRMED DEAD ({len(unused)} classes):")
for t in unused:
    print(f"  {t}")
