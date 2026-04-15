"""
Cleans tailwind.min.css:
1. Removes the 3 incorrectly-encoded shadow rules (used \2c0 instead of \2c space)
2. Removes dead CSS classes (never used in HTML, never toggled by JS)

Dead classes to remove:
  - Old orange color scheme variants (replaced by green)
  - Classes never referenced anywhere
  - Encoding artifacts
"""
import re

CSS_FILE = 'public/css/tailwind/tailwind.min.css'

with open(CSS_FILE, encoding='utf-8') as f:
    css = f.read()

original_size = len(css)

# ── 1. Remove the 3 bad shadow rules with wrong comma encoding (\2c0 vs \2c space)
# These selectors have \2c0 which decodes to U+02C0 (ˀ), not comma
BAD_SHADOW_PATTERNS = [
    # shadow-[0_4px_12px_rgba(0,0,0,0.08)] with wrong encoding
    r'\.shadow-\[0_4px_12px_rgba\(0\\2c0\\2c0\\2c0\\\.08\\\)\\\]\{[^}]+\}',
    r'\.shadow-\\?\[0_4px_12px_rgba\\?\(0\\2c0\\2c0\\2c0\\\.08\\?\)\\?\]\{[^}]+\}',
    # shadow-[0_8px_20px_rgba(0,0,0,0.22)] with wrong encoding
    r'\.shadow-\[0_8px_20px_rgba\(0\\2c0\\2c0\\2c0\\\.22\\\)\\\]\{[^}]+\}',
    r'\.shadow-\\?\[0_8px_20px_rgba\\?\(0\\2c0\\2c0\\2c0\\\.22\\?\)\\?\]\{[^}]+\}',
    # hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] with wrong encoding
    r'\.hover\\:shadow-\[0_12px_40px_rgba\(0\\2c0\\2c0\\2c0\\\.08\\\)\\\]:hover\{[^}]+\}',
    r'\.hover\\?:shadow-\\?\[0_12px_40px_rgba\\?\(0\\2c0\\2c0\\2c0\\\.08\\?\)\\?\]:hover\{[^}]+\}',
]

# Simpler approach: find and remove rules by looking for the \2c0 pattern in shadow selectors
# The bad rules have \2c0 (no space between 2c and 0) in shadow class names
bad_shadow_re = re.compile(
    r'\.(?:hover\\:)?shadow-\\\[0_[0-9]+px_[0-9]+px_rgba\\\(0\\2c0\\2c0\\2c0\\\.(?:08|22)\\\)\\\](?::hover)?\{[^}]+\}'
)
count_bad = len(bad_shadow_re.findall(css))
css = bad_shadow_re.sub('', css)
print(f'Removed {count_bad} bad shadow rules (wrong comma encoding)')

# ── 2. Remove dead CSS: old orange color scheme
# These orange hover/focus states were replaced by the green scheme
DEAD_RULES = [
    # Old orange focus states
    r'\.focus\\:bg-orange-500:focus\{[^}]+\}',
    r'\.focus\\:ring-orange-200:focus\{[^}]+\}',
    # Old orange hover states
    r'\.hover\\:bg-orange-400:hover\{[^}]+\}',
    r'\.hover\\:bg-orange-600:hover\{[^}]+\}',
    r'\.hover\\:bg-black\\\[0\\\.02\\\]:hover\{[^}]+\}',
    r'\.hover\\:bg-black\\\/\\\[0\\\.02\\\]:hover\{[^}]+\}',
    # py-18 is not a standard Tailwind class (no 4.5rem step)
    r'\.py-18\{[^}]+\}',
]

removed_count = 0
for pattern in DEAD_RULES:
    new_css, n = re.subn(pattern, '', css)
    if n > 0:
        css = new_css
        removed_count += n
        print(f'  Removed rule matching: {pattern[:60]}')

print(f'Removed {removed_count} dead CSS rules')

# ── 3. Write back
with open(CSS_FILE, 'w', encoding='utf-8') as f:
    f.write(css)

new_size = len(css)
saved = original_size - new_size
print(f'\nFile size: {original_size} → {new_size} bytes (saved {saved} bytes)')
