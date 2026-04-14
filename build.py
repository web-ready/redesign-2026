"""
Build script: regenerate public/ from src/.

Workflow:
  - Reads every src/pages/**.html
  - Resolves {{include partial-name.html}} markers by inlining src/partials/...
  - Substitutes {{base}} per page based on the page's directory depth
  - Loads seo-config.json and injects per-page SEO variables (title, description,
    canonical URL, OG image, JSON-LD structured data)
  - Writes the result to public/ with the same directory structure

Usage:
  python3 build.py            # full build
  python3 build.py --check    # build to a temp dir and diff against public/, no writes

Add new partials by dropping files into src/partials/ and referencing them as
{{include name.html}} from any page (or from another partial).
"""
from pathlib import Path
import argparse
import html
import json
import re
import shutil
import sys
import tempfile
import urllib.parse

ROOT = Path(__file__).resolve().parent
SRC_PAGES = ROOT / 'src' / 'pages'
SRC_PARTIALS = ROOT / 'src' / 'partials'
OUT = ROOT / 'public'
SEO_CONFIG_PATH = ROOT / 'seo-config.json'

INCLUDE_RE = re.compile(r'\{\{\s*include\s+([^\s}]+)\s*\}\}')
MAX_INCLUDE_DEPTH = 5


def load_seo_config():
    """Load the SEO configuration from seo-config.json."""
    if not SEO_CONFIG_PATH.exists():
        print(f'WARNING: {SEO_CONFIG_PATH} not found. SEO variables will be empty.',
              file=sys.stderr)
        return None
    with open(SEO_CONFIG_PATH, encoding='utf-8') as f:
        return json.load(f)


def canonical_url_for(site_url, page_rel):
    """Derive the canonical URL from a page's relative path."""
    page_str = str(page_rel).replace('\\', '/')
    if page_str == 'index.html':
        return site_url + '/'
    if page_str.endswith('/index.html'):
        # e.g. blog/index.html -> /blog/
        return site_url + '/' + page_str.replace('/index.html', '/')
    # e.g. about.html -> /about  (Vercel cleanUrls strips .html)
    return site_url + '/' + page_str.replace('.html', '')


def og_image_url_for(site_url, title):
    """Build the dynamic OG image URL for a page."""
    encoded_title = urllib.parse.quote(title, safe='')
    return f'{site_url}/api/og?title={encoded_title}'


def build_jsonld(page_meta, canonical, og_image, seo_config):
    """Generate JSON-LD structured data for a page."""
    site_name = seo_config['site_name']
    site_url = seo_config['site_url']
    site_logo = seo_config['site_logo']

    publisher = {
        '@type': 'Organization',
        'name': site_name,
        'url': site_url,
        'logo': {
            '@type': 'ImageObject',
            'url': site_logo
        }
    }

    og_type = page_meta.get('og_type', 'website')

    if og_type == 'article':
        ld = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': page_meta['title'],
            'description': page_meta['description'],
            'url': canonical,
            'image': og_image,
            'publisher': publisher
        }
        if page_meta.get('article_author'):
            ld['author'] = {
                '@type': 'Person',
                'name': page_meta['article_author']
            }
    else:
        ld = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': page_meta['title'],
            'description': page_meta['description'],
            'url': canonical,
            'image': og_image,
            'publisher': publisher
        }

    return '    <script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>'


def seo_vars_for(page_rel, seo_config):
    """Build the SEO template variables for a given page."""
    page_key = str(page_rel).replace('\\', '/')
    if seo_config is None or page_key not in seo_config.get('pages', {}):
        # Return empty strings so {{seo_*}} placeholders are cleared
        return {
            'seo_title': '',
            'seo_description': '',
            'seo_og_type': 'website',
            'seo_canonical': '',
            'seo_og_image': '',
            'seo_extra_meta': '',
            'seo_jsonld': '',
        }

    site_url = seo_config['site_url']
    page_meta = seo_config['pages'][page_key]
    title = page_meta['title']
    description = page_meta['description']
    og_type = page_meta.get('og_type', seo_config.get('default_og_type', 'website'))
    canonical = canonical_url_for(site_url, page_rel)
    og_image = og_image_url_for(site_url, title)

    # Extra meta tags (article-specific)
    extra_meta_lines = []
    if page_meta.get('article_author'):
        extra_meta_lines.append(
            f'    <meta property="article:author" content="{html.escape(page_meta["article_author"])}">')
    extra_meta = '\n'.join(extra_meta_lines)
    if extra_meta:
        extra_meta += '\n'

    jsonld = build_jsonld(page_meta, canonical, og_image, seo_config)

    return {
        'seo_title': html.escape(title, quote=True),
        'seo_description': html.escape(description, quote=True),
        'seo_og_type': og_type,
        'seo_canonical': canonical,
        'seo_og_image': og_image,
        'seo_extra_meta': extra_meta,
        'seo_jsonld': jsonld,
    }


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

    seo_config = load_seo_config()

    pages = sorted(p for p in SRC_PAGES.rglob('*.html') if p.is_file())
    print(f'Building {len(pages)} pages -> {out_dir}/')
    for page in pages:
        rel = page.relative_to(SRC_PAGES)
        out_path = out_dir / rel
        out_path.parent.mkdir(parents=True, exist_ok=True)
        page_vars = {'base': base_for(rel)}
        page_vars.update(seo_vars_for(rel, seo_config))
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
