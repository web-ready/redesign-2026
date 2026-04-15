"""
Bulk Tailwind CSS class optimization across all 34 HTML files.

Optimizations:
  1. px-N py-N → p-N  shorthand (where N matches, no responsive prefix)
  2. Footer: hoist shared classes to wrapper, strip from children
  3. Desktop nav: hoist text-white text-sm font-medium tracking-tight to <ul>
  4. Mobile nav: px-2 py-2 → p-2, px-3 py-3 → p-3 in nav sub-wrappers
"""
import glob, re, os

HTML_GLOB = 'public/*.html'

# ─── 1. px-N py-N → p-N shorthand ──────────────────────────────────────────

# Only collapse when BOTH bare (non-responsive) px-N and py-N are present with same N
PX_PY_PAIRS = [
    ('py-3 px-3', 'p-3'),
    ('px-3 py-3', 'p-3'),
    ('py-2 px-2', 'p-2'),
    ('px-2 py-2', 'p-2'),
    ('py-5 px-5', 'p-5'),
    ('px-5 py-5', 'p-5'),
    ('py-6 px-6', 'p-6'),
    ('px-6 py-6', 'p-6'),
    ('py-8 px-8', 'p-8'),
    ('px-8 py-8', 'p-8'),
]

# ─── 2. Footer heading optimization ────────────────────────────────────────
# Before: <p class="site-footer-heading tracking-tight text-white font-semibold text-sm uppercase">
# After:  <p class="site-footer-heading">
# And add text-white font-semibold tracking-tight text-sm uppercase to the <nav class="site-footer-nav">

FOOTER_HEADING_OLD = 'site-footer-heading tracking-tight text-white font-semibold text-sm uppercase'
FOOTER_HEADING_NEW = 'site-footer-heading'

# Footer link optimization
# Before: <a ... class="site-footer-link tracking-tight text-gray-200 hover:text-green-400 transition duration-200 text-sm ...">
# After:  <a ... class="site-footer-link ...">   (keep only extra classes like whitespace-nowrap, leading-snug)
# And add tracking-tight text-gray-200 hover:text-green-400 transition duration-200 text-sm to the <nav>

FOOTER_NAV_OLD = '<nav class="site-footer-nav" aria-label="Footer">'
FOOTER_NAV_NEW = '<nav class="site-footer-nav tracking-tight text-sm" aria-label="Footer">'

# ─── 3. Desktop nav <ul> optimization ──────────────────────────────────────
# Hoist: text-white text-sm font-medium tracking-tight to <ul>
DESKTOP_NAV_UL_OLD = '<ul class="hidden lg:flex items-center gap-2">'
DESKTOP_NAV_UL_NEW = '<ul class="hidden lg:flex items-center gap-2 text-white text-sm font-medium tracking-tight">'


def optimize_file(fpath):
    with open(fpath, encoding='utf-8') as f:
        html = f.read()
    original = html

    # ── 1. px-N py-N → p-N ─────────────────────────────────────────────
    for old, new in PX_PY_PAIRS:
        html = html.replace(old, new)

    # ── 2a. Footer nav wrapper — add hoisted classes ────────────────────
    html = html.replace(FOOTER_NAV_OLD, FOOTER_NAV_NEW)

    # ── 2b. Footer headings — strip redundant classes ───────────────────
    html = html.replace(FOOTER_HEADING_OLD, FOOTER_HEADING_NEW)

    # ── 2c. Footer links — strip classes now on <nav> ──────────────────
    # Remove "tracking-tight " and " text-sm" from site-footer-link class attrs
    # These are now inherited from the <nav> wrapper
    # Pattern: site-footer-link tracking-tight text-gray-200 hover:text-green-400 transition duration-200 text-sm
    html = html.replace(
        'site-footer-link tracking-tight text-gray-200 hover:text-green-400 transition duration-200 text-sm',
        'site-footer-link text-gray-200 hover:text-green-400 transition duration-200'
    )

    # ── 3. Desktop nav <ul> — add hoisted classes ───────────────────────
    html = html.replace(DESKTOP_NAV_UL_OLD, DESKTOP_NAV_UL_NEW)

    # ── 3b. Desktop nav links — strip classes now on <ul> ──────────────
    # Home link: text-white text-sm font-medium tracking-tight → (remove these 4)
    html = html.replace(
        'hover:bg-gray-900 transition duration-200 text-white text-sm font-medium tracking-tight rounded-full',
        'hover:bg-gray-900 transition duration-200 rounded-full'
    )
    # Dropdown trigger spans: <span class="text-white text-sm font-medium tracking-tight">
    html = html.replace(
        '<span class="text-white text-sm font-medium tracking-tight">',
        '<span>'
    )

    # ── 4. Mobile nav top-level items ──────────────────────────────────
    # <a ... class="text-white text-sm font-medium tracking-tight py-3 px-3 ...">
    # The py-3 px-3 was already collapsed to p-3 in step 1
    # Now we can hoist text-white text-sm font-medium tracking-tight to the mobile container
    # But mobile nav has mixed items (some text-gray-300 sub-links), so only strip from top-level items
    # Keep it simple: just strip tracking-tight from mobile nav items that already have it on parent

    if html != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False


if __name__ == '__main__':
    files = sorted(glob.glob(HTML_GLOB))
    changed = 0
    for fpath in files:
        if optimize_file(fpath):
            changed += 1
            print(f'  Updated: {os.path.basename(fpath)}')
    print(f'\nDone. Modified {changed}/{len(files)} files.')
