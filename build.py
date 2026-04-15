"""
Build script: regenerate public/ from src/.

Workflow:
  - Reads every src/pages/**.html
  - Resolves {{include partial-name.html}} markers by inlining src/partials/...
  - Substitutes {{base}} per page based on the page's directory depth
    (so a page at src/pages/blog/foo.html gets base="../", root pages get base="")
  - Writes the result to public/ with the same directory structure

Usage:
  python3 build.py            # full build
  python3 build.py --check    # build to a temp dir and diff against public/, no writes

Add new partials by dropping files into src/partials/ and referencing them as
{{include name.html}} from any page (or from another partial).
"""
from pathlib import Path
import argparse
import re
import shutil
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
SRC_PAGES = ROOT / 'src' / 'pages'
SRC_PARTIALS = ROOT / 'src' / 'partials'
OUT = ROOT / 'public'

INCLUDE_RE = re.compile(r'\{\{\s*include\s+([^\s}]+)\s*\}\}')
MAX_INCLUDE_DEPTH = 5


def base_for(page_rel_path):
    """Number of '../' needed to reach the public/ root from this page."""
    depth = len(Path(page_rel_path).parts) - 1  # subtract the file itself
    return '../' * depth


def render(content, page_vars, depth=0):
    if depth > MAX_INCLUDE_DEPTH:
        raise RuntimeError(f'Include depth > {MAX_INCLUDE_DEPTH} (circular include?)')

    # 1) Resolve {{include partial.html}} markers (recursively)
    def resolve(match):
        name = match.group(1)
        path = SRC_PARTIALS / name
        if not path.exists():
            raise FileNotFoundError(f'Partial not found: {path}')
        return render(path.read_text(encoding='utf-8'), page_vars, depth + 1)

    content = INCLUDE_RE.sub(resolve, content)

    # 2) Substitute simple {{var}} placeholders
    for key, value in page_vars.items():
        content = content.replace('{{' + key + '}}', value)

    return content


def build(out_dir):
    if not SRC_PAGES.exists():
        print(f'ERROR: {SRC_PAGES} not found. Have you run scripts/migrate_phase1.py yet?',
              file=sys.stderr)
        return 1

    pages = sorted(p for p in SRC_PAGES.rglob('*.html') if p.is_file())
    print(f'Building {len(pages)} pages -> {out_dir}/')
    for page in pages:
        rel = page.relative_to(SRC_PAGES)
        out_path = out_dir / rel
        out_path.parent.mkdir(parents=True, exist_ok=True)
        page_vars = {'base': base_for(rel)}
        try:
            rendered = render(page.read_text(encoding='utf-8'), page_vars)
        except Exception as e:
            print(f'ERROR rendering {rel}: {e}', file=sys.stderr)
            return 1
        out_path.write_text(rendered, encoding='utf-8')
    print(f'Built {len(pages)} pages.')
    return 0


def check():
    """Build to a temp dir, diff against public/, report changed files."""
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        result = build(tmp_path)
        if result != 0:
            return result

        changed = []
        for page in sorted(p for p in tmp_path.rglob('*.html') if p.is_file()):
            rel = page.relative_to(tmp_path)
            existing = OUT / rel
            new_content = page.read_text(encoding='utf-8')
            if not existing.exists():
                changed.append((rel, 'NEW'))
            elif existing.read_text(encoding='utf-8') != new_content:
                changed.append((rel, 'CHANGED'))

        if not changed:
            print('No differences. Generated public/ matches existing.')
        else:
            print(f'\n{len(changed)} file(s) would change:')
            for rel, status in changed:
                print(f'  [{status}] {rel}')
        return 0


def main():
    parser = argparse.ArgumentParser(description='Build public/ from src/')
    parser.add_argument('--check', action='store_true',
                        help='Dry-run: build to temp dir, report diff vs public/')
    args = parser.parse_args()
    if args.check:
        sys.exit(check())
    sys.exit(build(OUT))


if __name__ == '__main__':
    main()
