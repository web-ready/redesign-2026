"""
Phase 1 migration: extract the footer into a partial.

Reads every public/*.html, finds the <footer class="site-global-footer">...</footer>
block, replaces it with `{{include footer.html}}`, and writes the result to
src/pages/ mirroring the directory structure.

The canonical footer (the one most pages share) is saved to
src/partials/footer.html with hard-coded relative paths rewritten to use the
{{base}} placeholder, which build.py substitutes per page based on directory
depth. This handles the blog/ subdirectory pages cleanly.

Run once. After this, edit src/ files and run build.py to regenerate public/.
"""
from collections import Counter
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
SRC = ROOT / 'src'
PAGES = SRC / 'pages'
PARTIALS = SRC / 'partials'

FOOTER_OPEN = '<footer class="site-global-footer'
FOOTER_CLOSE = '</footer>'


def find_footer(html):
    s = html.find(FOOTER_OPEN)
    if s == -1:
        return None
    e = html.find(FOOTER_CLOSE, s)
    if e == -1:
        return None
    return s, e + len(FOOTER_CLOSE)


def rewrite_paths_to_placeholder(footer_html):
    """Convert hardcoded relative paths to {{base}}-prefixed paths.

    Only rewrites href/src attributes whose value:
      - is non-empty
      - does not start with http://, https://, /, #, mailto:, tel:, or {{
      - does not start with ../ (we'll normalize away the ../ prefix from blog footers)
    """
    def replace(match):
        attr = match.group(1)  # 'href' or 'src'
        quote = match.group(2)  # ' or "
        url = match.group(3)
        if not url:
            return match.group(0)
        if url.startswith(('http://', 'https://', '//', '/', '#', 'mailto:', 'tel:', '{{')):
            return match.group(0)
        # Strip leading ../ — blog pages had these; the {{base}} placeholder will inject them back per page
        cleaned = url
        while cleaned.startswith('../'):
            cleaned = cleaned[3:]
        return f'{attr}={quote}{{{{base}}}}{cleaned}{quote}'

    return re.sub(r'\b(href|src)=(["\'])([^"\']*)\2', replace, footer_html)


def main():
    if not PUBLIC.exists():
        print(f'ERROR: {PUBLIC} not found', file=sys.stderr)
        sys.exit(1)

    files = sorted(p for p in PUBLIC.rglob('*.html') if p.is_file())
    print(f'Scanning {len(files)} HTML files...')

    # 1) Find the canonical footer (most common variant)
    counts = Counter()
    for f in files:
        html = f.read_text(encoding='utf-8')
        loc = find_footer(html)
        if loc is None:
            continue
        s, e = loc
        counts[html[s:e]] += 1

    if not counts:
        print('ERROR: no footers found', file=sys.stderr)
        sys.exit(1)

    canonical_footer, canonical_count = counts.most_common(1)[0]
    print(f'Canonical footer: appears in {canonical_count}/{len(files)} pages, '
          f'{len(canonical_footer)} bytes')

    # 2) Rewrite the canonical footer to use {{base}} for relative paths
    partial = rewrite_paths_to_placeholder(canonical_footer)
    PARTIALS.mkdir(parents=True, exist_ok=True)
    (PARTIALS / 'footer.html').write_text(partial, encoding='utf-8')
    print(f'Wrote src/partials/footer.html ({len(partial)} bytes)')

    # 3) Mirror each public/ page into src/pages/ with footer replaced by include
    PAGES.mkdir(parents=True, exist_ok=True)
    written = 0
    no_footer = 0
    for f in files:
        html = f.read_text(encoding='utf-8')
        loc = find_footer(html)
        rel = f.relative_to(PUBLIC)
        out = PAGES / rel
        out.parent.mkdir(parents=True, exist_ok=True)

        if loc is None:
            out.write_text(html, encoding='utf-8')
            no_footer += 1
            continue

        s, e = loc
        new_html = html[:s] + '{{include footer.html}}' + html[e:]
        out.write_text(new_html, encoding='utf-8')
        written += 1

    print(f'Wrote {written} pages to src/pages/ ({no_footer} had no footer)')
    print()
    print('Next: run `python3 build.py` to regenerate public/ from src/')


if __name__ == '__main__':
    main()
