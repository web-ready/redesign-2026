"""
Page-specific Tailwind class inheritance optimizations.
Targets: metric stat cards, case study sections, and other page-specific patterns.
"""
import re, glob, os

HTML_DIR = 'public'

def edit(fpath, old, new):
    """Replace old with new in file, return True if changed."""
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    if old not in content:
        return False
    content = content.replace(old, new)
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

changes = []

# ─── Mittler Senior Technology: metric stat cards ──────────────────────────
# Hoist text-white to each card container, strip from h3 and p children
for card_data in [
    ('98.2%', 'Energy reduction', 'Energy use per visit fell from 0.0139 kWh to 0.0002 kWh through a more efficient website build.'),
    ('98.1%', 'Carbon reduction', 'CO₂ per page visit dropped from 5.31g to 0.10g, dramatically lowering the website\'s environmental impact.'),
    ('98.1%', 'Water reduction', 'Water consumption per visit decreased from 2.95L to 0.06L, showing the wider resource savings of optimization.'),
]:
    val, label, desc = card_data
    old = f'''                <div class="h-full rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12">
                  <h3 class="font-heading tracking-tight text-6xl md:text-7xl font-medium text-center mb-6 text-white">
                    {val}
                  </h3>
                  <p class="text-center tracking-tight text-white text-xl font-semibold mb-4">
                    {label}
                  </p>'''
    new = f'''                <div class="h-full rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12 text-white">
                  <h3 class="font-heading tracking-tight text-6xl md:text-7xl font-medium text-center mb-6">
                    {val}
                  </h3>
                  <p class="text-center tracking-tight text-xl font-semibold mb-4">
                    {label}
                  </p>'''
    if edit(f'{HTML_DIR}/mittler-senior-technology.html', old, new):
        changes.append(('mittler-senior-technology.html', f'Stat card: {label}'))

# ─── OOC Self Case Study: metric stat cards (same pattern) ────────────────
fp = f'{HTML_DIR}/ooc-self-case-study.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()

# These cards have h3 text-white and p text-white - hoist to card container
old_card_pattern = 'h-full rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12">'
new_card_pattern = 'h-full rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 md:px-8 md:py-12 text-white">'
if old_card_pattern in content:
    content = content.replace(old_card_pattern, new_card_pattern)
    # Now strip text-white from h3 and p inside these cards
    content = content.replace(
        'font-heading tracking-tight text-6xl md:text-7xl font-medium text-center mb-6 text-white',
        'font-heading tracking-tight text-6xl md:text-7xl font-medium text-center mb-6'
    )
    content = content.replace(
        'text-center tracking-tight text-white text-xl font-semibold mb-4',
        'text-center tracking-tight text-xl font-semibold mb-4'
    )
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('ooc-self-case-study.html', 'Stat cards text-white hoisted'))

# ─── Denman Place Mall: metric stat cards ─────────────────────────────────
fp = f'{HTML_DIR}/denman-place-mall.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
if old_card_pattern in content:
    content = content.replace(old_card_pattern, new_card_pattern)
    content = content.replace(
        'font-heading tracking-tight text-6xl md:text-7xl font-medium text-center mb-6 text-white',
        'font-heading tracking-tight text-6xl md:text-7xl font-medium text-center mb-6'
    )
    content = content.replace(
        'text-center tracking-tight text-white text-xl font-semibold mb-4',
        'text-center tracking-tight text-xl font-semibold mb-4'
    )
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('denman-place-mall.html', 'Stat cards text-white hoisted'))

# ─── Oasis-of-change-website.html: metrics section ────────────────────────
fp = f'{HTML_DIR}/oasis-of-change-website.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
original = content

# Hoist text-white to the metrics section
content = content.replace(
    '<section class="bg-black py-20 md:py-24 relative overflow-hidden">',
    '<section class="bg-black py-20 md:py-24 relative overflow-hidden text-white">'
)
# Strip text-white from h2 in metrics section
content = content.replace(
    'font-heading tracking-tight text-3xl md:text-5xl lg:text-6xl font-medium text-white mb-6',
    'font-heading tracking-tight text-3xl md:text-5xl lg:text-6xl font-medium mb-6'
)
# Strip text-white from the 3 "Baseline pending" paragraphs
content = content.replace(
    '<p class="text-white text-2xl md:text-3xl font-semibold tracking-tight mb-3">Baseline pending</p>',
    '<p class="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Baseline pending</p>'
)
if content != original:
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('oasis-of-change-website.html', 'Metrics section text-white hoisted'))

# ─── Annual Reports: hoist text-white ─────────────────────────────────────
fp = f'{HTML_DIR}/annual_reports.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
original = content

# The dark card container
content = content.replace(
    'rounded-[2rem] border border-white/10 bg-[#111111] p-6 md:p-8">',
    'rounded-[2rem] border border-white/10 bg-[#111111] p-6 md:p-8 text-white">'
)
# Strip text-white from h2 and h3 headings inside
content = content.replace(
    '<h2 class="text-white text-2xl',
    '<h2 class="text-2xl'
)
content = content.replace(
    '<h3 class="text-white text-xl',
    '<h3 class="text-xl'
)
# Strip from the "More fiscal years" text
content = content.replace(
    '<p class="text-white text-lg',
    '<p class="text-lg'
)
if content != original:
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('annual_reports.html', 'Available reports section text-white hoisted'))

# ─── Get Involved: hoist text-white to cards ──────────────────────────────
fp = f'{HTML_DIR}/get_involved.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
original = content

# Each card has bg-[#111111] - add text-white there
content = content.replace(
    'rounded-[2rem] border border-white/10 bg-[#111111] p-6 md:p-8">',
    'rounded-[2rem] border border-white/10 bg-[#111111] p-6 md:p-8 text-white">'
)
# Strip text-white from h2 headings in cards
content = content.replace(
    '<h2 class="text-white text-2xl',
    '<h2 class="text-2xl'
)
if content != original:
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('get_involved.html', 'Card headings text-white hoisted'))

# ─── About.html: Board of Directors section ──────────────────────────────
fp = f'{HTML_DIR}/about.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
original = content

# The Board of Directors outer container
content = content.replace(
    'id="our-board" class="px-6 md:px-16 lg:px-24 py-24">\n        <div class="bg-black rounded-2xl p-10 md:p-16 lg:p-20">',
    'id="our-board" class="px-6 md:px-16 lg:px-24 py-24">\n        <div class="bg-black rounded-2xl p-10 md:p-16 lg:p-20 text-white">'
)
# Strip text-white from h2 and h3 in that section
# h2: "Board of Directors"
content = content.replace(
    'font-heading tracking-tight text-white text-3xl md:text-4xl lg:text-5xl font-semibold">Board of Directors',
    'font-heading tracking-tight text-3xl md:text-4xl lg:text-5xl font-semibold">Board of Directors'
)
# h3: board member names
content = content.replace(
    '<h3 class="text-white text-xl font-semibold mb-1">',
    '<h3 class="text-xl font-semibold mb-1">'
)
if content != original:
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('about.html', 'Board of Directors text-white hoisted'))

# ─── About.html: "Our Name" OASIS/OF/CHANGE section ──────────────────────
fp = f'{HTML_DIR}/about.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
original = content

# h2: "A name chosen with intention"
content = content.replace(
    '<h2 class="text-white text-3xl',
    '<h2 class="text-3xl'
)
# spans: OASIS, OF, CHANGE — these have text-white within their class strings
content = content.replace(
    'font-bold text-white tracking-tight',
    'font-bold tracking-tight'
)
if content != original:
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('about.html', 'OASIS/OF/CHANGE name section text-white stripped'))

# ─── Example Annual Report: stat card section ─────────────────────────────
fp = f'{HTML_DIR}/example_annual_report.html'
with open(fp, encoding='utf-8') as f:
    content = f.read()
original = content

# Strip text-white from stat value paragraphs (parent dark section already provides context)
content = content.replace(
    '<p class="text-3xl md:text-4xl font-heading font-medium tracking-tight text-white mb-2">',
    '<p class="text-3xl md:text-4xl font-heading font-medium tracking-tight mb-2">'
)
if content != original:
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    changes.append(('example_annual_report.html', 'Stat values text-white stripped'))

# ─── Print summary ────────────────────────────────────────────────────────
print(f'Applied {len(changes)} page-specific optimizations:')
for fname, desc in changes:
    print(f'  {fname}: {desc}')
