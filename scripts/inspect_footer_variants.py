"""One-off: inspect footer variants and show diffs."""
from pathlib import Path
from collections import defaultdict
import difflib

PUBLIC = Path('public')
files = sorted(p for p in PUBLIC.rglob('*.html') if p.is_file())

variants = defaultdict(list)
for f in files:
    html = f.read_text(encoding='utf-8')
    s = html.find('<footer class="site-global-footer')
    if s == -1:
        continue
    e = html.find('</footer>', s)
    if e == -1:
        continue
    e += len('</footer>')
    rel = str(f.relative_to(PUBLIC)).replace('\\', '/')
    variants[html[s:e]].append(rel)

sorted_variants = sorted(variants.items(), key=lambda x: -len(x[1]))
canonical = sorted_variants[0][0]
canonical_lines = canonical.splitlines()

print(f'{len(sorted_variants)} variants found.')
print()

for i, (text, file_list) in enumerate(sorted_variants[1:], 2):
    other_lines = text.splitlines()
    diff = list(difflib.unified_diff(
        canonical_lines, other_lines,
        fromfile='canonical', tofile=f'variant_{i}',
        n=1, lineterm=''
    ))
    print(f'=== DIFF: canonical (25 pages) vs variant {i} ({len(file_list)} pages) ===')
    print(f'Pages: {", ".join(file_list)}')
    print('\n'.join(diff))
    print()
