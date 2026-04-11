"""
Phase 0 — ADD:    Append the 3 classes that were always missing (found in HTML,
                  not in CSS).
Phase 1 — TEST:   Verify every dead class is absent from all HTML and JS files.
Phase 2 — DELETE: Surgically remove the 72 dead rules from tailwind.min.css,
                  correctly handling comma-grouped selectors (strip only the dead
                  class from a group rather than deleting the whole rule).

Run with --test-only to skip phases 0 and 2.
"""
import re, glob, os, sys, shutil

CSS_FILE  = 'public/css/tailwind/tailwind.min.css'
HTML_GLOB = 'public/*.html'
JS_GLOB   = 'public/js/*.js'

# ─── CLASSES THAT WERE ALWAYS MISSING (add before deleting) ─────────────────

MISSING_TO_ADD = """\
.font-light{font-weight:300}\
.text-white\\/30{color:hsla(0,0%,100%,.3)}\
@media (min-width:768px){.md\\:text-\\[3\\.5rem\\]{font-size:3.5rem;line-height:1}}\
"""

# ─── DEAD CLASSES ────────────────────────────────────────────────────────────

DEAD = [
    # Group A
    '-rotate-45', 'fixed', 'opacity-100', 'opacity-20', 'overflow-y-auto',
    'rotate-45', 'top-0', 'top-1', 'top-[17px]', 'top-[9px]', 'transform',
    # Group B
    'sm:gap-12', 'sm:max-w-2xl', 'sm:object-[center_70%]', 'sm:pt-14', 'sm:pt-20',
    'md:block', 'md:flex-1', 'md:gap-0', 'md:gap-16', 'md:min-w-0',
    'md:object-[center_78%]', 'md:pt-16', 'md:px-14',
    'lg:h-20', 'lg:h-[500px]', 'lg:leading-9', 'lg:max-w-5xl',
    'lg:min-h-[340px]', 'lg:min-h-full', 'lg:mx-auto', 'lg:object-[center_82%]',
    'lg:text-4xl', 'lg:text-center', 'lg:w-[24%]', 'lg:w-[76%]',
    'xl:col-span-4', 'xl:col-span-8', 'xl:flex', 'xl:gap-16',
    'xl:grid-cols-12', 'xl:grid-cols-[1.35fr_0.8fr]', 'xl:h-[360px]',
    'xl:hidden', 'xl:inline-flex', 'xl:min-h-full',
    # Group C
    '-translate-y-[8px]', 'bg-[#f8f8f4]', 'bg-black/60', 'gap-24', 'h-10',
    'leading-[0.92]', 'leading-[0.98]', 'max-w-[12ch]', 'max-w-[22rem]',
    'max-w-[8.5ch]', 'mb-0', 'min-h-[320px]', 'pb-2', 'pt-5',
    'rounded-[1.25rem]', 'shadow-2xl', 'shadow-[0_20px_60px_rgba(0,0,0,0.06)]',
    'text-7xl', 'text-outline', 'translate-y-[8px]', 'w-5/6',
    'w-[300px]', 'w-[340px]', 'w-[88%]', 'w-px', 'z-[200]',
]

# ─── PHASE 1: TEST ───────────────────────────────────────────────────────────

def test():
    failures = {}
    html_files = glob.glob(HTML_GLOB)
    js_files   = glob.glob(JS_GLOB)

    for cls in DEAD:
        hits = []

        # HTML: must appear as whitespace-delimited token in class="..."
        for fpath in html_files:
            content = open(fpath, encoding='utf-8').read()
            for m in re.finditer(r'class=["\']([^"\']+)["\']', content):
                if cls in m.group(1).split():
                    lineno = content[:m.start()].count('\n') + 1
                    hits.append((os.path.basename(fpath), f'line {lineno}'))

        # JS: classList operations and className assignments only
        for fpath in js_files:
            content = open(fpath, encoding='utf-8').read()
            for i, line in enumerate(content.split('\n'), 1):
                if re.search(
                    r'classList\.(add|remove|toggle|contains)\s*\(["\']'
                    + re.escape(cls) + r'["\']', line
                ):
                    hits.append((os.path.basename(fpath), f'line {i}: classList'))
                for m in re.finditer(
                    r'\.className\s*[+]?=\s*["\']([^"\']+)["\']', line
                ):
                    if cls in m.group(1).split():
                        hits.append((os.path.basename(fpath), f'line {i}: className='))
                for m in re.finditer(
                    r'setAttribute\s*\(["\']class["\'],\s*["\']([^"\']+)["\']', line
                ):
                    if cls in m.group(1).split():
                        hits.append((os.path.basename(fpath), f'line {i}: setAttribute'))

        if hits:
            failures[cls] = hits

    return failures


# ─── PHASE 2: DELETE (grouped-selector-aware) ───────────────────────────────

BS = chr(92)

def tw_to_css_ident(cls):
    """Tailwind class name → escaped CSS identifier (after the dot)."""
    out = []
    for ch in cls:
        if ch == ',':
            out.append(BS + '2c ')   # hex escape + space so next digit is separate
        elif ch in ':./[]()#%^*+!@':
            out.append(BS + ch)
        else:
            out.append(ch)
    return ''.join(out)


def delete_dead_from_css(css, dead_classes):
    """
    For each dead class:
      - If it appears as the sole selector in a rule → remove the whole rule.
      - If it appears in a comma-grouped selector → strip just that class from
        the group and leave the rest intact.
    Works inside @media blocks too.
    """
    dead_idents = {cls: tw_to_css_ident(cls) for cls in dead_classes}
    removed = []

    for cls, ident in dead_idents.items():
        # Build a pattern for the exact selector token (with optional :pseudo suffix)
        # e.g.  .top-0  or  .hover\:top-0:hover  or  .group:hover .group-hover\:top-0
        esc_ident = re.escape(ident)
        # Selector token: dot + ident + optional pseudo/descendant suffix
        # We match up to but not including the next comma or {
        sel_tok = r'\.' + esc_ident + r'(?::[a-z\-]+| [^,{]+)?'

        # Pattern for the full rule block (selector list + { props })
        # Selector may be comma-separated; properties don't contain unescaped {/}
        full_rule = re.compile(
            r'(' + sel_tok + r')\s*\{[^{}]*\}'   # sole selector form
        )

        # Pattern for comma-grouped selector:  ..., .DEAD, ...  or  .DEAD, ...
        grouped = re.compile(
            # dead class preceded by comma (middle/last position)
            r',\s*(' + sel_tok + r')(?=\s*[,{])'
            r'|'
            # dead class at start, followed by comma (first position)
            r'(' + sel_tok + r')\s*,'
        )

        original = css

        def strip_from_group(m):
            """Remove only the dead selector token from a grouped selector."""
            return ''

        # First: strip from grouped selectors (but keep the rest of the rule)
        css = grouped.sub('', css)

        # Second: remove any standalone rules that are now just the dead class alone
        # (After group-stripping, an empty selector might remain — catch that too)
        css = re.sub(r'\.' + esc_ident + r'(?::[a-z\-]+)?\s*\{[^{}]*\}', '', css)

        # Also handle @media-wrapped solo rules
        # e.g. @media (...){.dead\:class{props}}
        css = re.sub(
            r'@media\s+[^{]+\{\s*\.' + esc_ident + r'(?::[a-z\-]+)?\s*\{[^{}]*\}\s*\}',
            '', css
        )

        if css != original:
            removed.append(cls)

    # Clean up any dangling commas left by group-stripping: ",{" → "{"
    css = re.sub(r',\s*\{', '{', css)
    # And leading/trailing commas in selectors
    css = re.sub(r'\{\s*,', '{', css)

    return css, removed


# ─── MAIN ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    test_only = '--test-only' in sys.argv

    # ── Phase 0: add the 3 always-missing classes ───────────────────────────
    if not test_only:
        print('PHASE 0: Adding 3 missing classes (font-light, text-white/30, md:text-[3.5rem])')
        with open(CSS_FILE, 'a', encoding='utf-8') as f:
            f.write(MISSING_TO_ADD)
        print('  Done.\n')

    # ── Phase 1: test ────────────────────────────────────────────────────────
    print('=' * 60)
    print('PHASE 1: TESTING ALL 72 DEAD CLASSES')
    print('=' * 60)

    failures = test()

    if failures:
        print(f'\nFAIL — {len(failures)} class(es) still referenced:\n')
        for cls, hits in failures.items():
            print(f'  [{cls}]')
            for fname, ctx in hits[:3]:
                print(f'    {fname}: {ctx}')
        print('\nAborting.')
        sys.exit(1)

    print(f'PASS — all {len(DEAD)} classes confirmed absent from HTML and JS.\n')

    if test_only:
        print('(--test-only, skipping deletion)')
        sys.exit(0)

    # ── Phase 2: delete ──────────────────────────────────────────────────────
    print('=' * 60)
    print('PHASE 2: DELETING FROM CSS')
    print('=' * 60)

    css = open(CSS_FILE, encoding='utf-8').read()
    original_size = len(css)

    shutil.copy(CSS_FILE, CSS_FILE + '.bak2')
    print(f'Backup: {CSS_FILE}.bak2')

    css, removed = delete_dead_from_css(css, DEAD)

    with open(CSS_FILE, 'w', encoding='utf-8') as f:
        f.write(css)

    not_found = [c for c in DEAD if c not in removed]
    saved = original_size - len(css)

    print(f'Removed {len(removed)}/{len(DEAD)} class rules.')
    print(f'Bytes: {original_size} -> {len(css)} (saved {saved} bytes / {saved/1024:.1f} KB)')

    if not_found:
        print(f'\nClasses with no matching CSS rule (already absent):')
        for c in not_found:
            print(f'  {c}')

    print('\nDone.')
