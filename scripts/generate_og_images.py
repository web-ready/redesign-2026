"""Post-build: generate a unique OG/Twitter card image for every real page based on its <title>,
and inject (or update) the og:image and twitter:image tags in each built HTML file.

Design: near-black background matching the site navbar; Oasis of Change logo lockup at top;
large page title centred vertically; a subtle green accent strip. Uses scripts/og_logo.png
(pre-rasterised from the brand SVG) so no SVG renderer is required at build time.

Redirect stubs (pages with <meta http-equiv="refresh">) are skipped — they shouldn't surface
their own OG card.

Run after build.py. Safe to re-run.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import html
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
OG_DIR = PUBLIC / 'images' / 'og'
LOGO_PATH = ROOT / 'scripts' / 'og_logo.png'

SITE_BASE = 'https://oasisofchange.com'
CANONICAL_SUFFIX = ' | Oasis of Change, Inc.'

# Canvas
W, H = 1200, 630

# Palette — matches site navbar + brand green (deep green used across the site)
BG = (10, 10, 10)             # #0a0a0a near-black, matches navbar bg
ACCENT = (22, 101, 52)        # #166534 green-800, primary site accent
TITLE_COLOR = (255, 255, 255)
MUTED = (156, 163, 175)       # #9ca3af gray-400
DIVIDER = (38, 38, 38)        # #262626 neutral-800

# Font candidates (first hit wins). Arial ships with Windows; DejaVu is Pillow's fallback.
FONT_BOLD_CANDIDATES = [
    'C:/Windows/Fonts/arialbd.ttf',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
]
FONT_REG_CANDIDATES = [
    'C:/Windows/Fonts/arial.ttf',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
]

PADDING_X = 72
LOGO_TARGET_HEIGHT = 88
ACCENT_BAR_WIDTH = 6


def load_font(candidates, size):
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def slug_for(html_path: Path) -> str:
    rel = html_path.relative_to(PUBLIC)
    if rel.name == 'index.html':
        parts = rel.parent.parts
        return '-'.join(parts) if parts else 'home'
    return rel.with_suffix('').as_posix().replace('/', '-')


def page_title(html_text: str) -> str:
    # Prefer <meta property="og:title"> so OG images reflect the customized social title.
    # Fall back to <title> if og:title is absent.
    raw = ''
    m_og = re.search(
        r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']*)["\']',
        html_text, re.I
    )
    if m_og:
        raw = html.unescape(m_og.group(1)).strip()
    if not raw:
        m_title = re.search(r'<title>([^<]*)</title>', html_text, re.I | re.S)
        if m_title:
            raw = html.unescape(m_title.group(1)).strip()
    if not raw:
        return 'Oasis of Change'
    if raw.endswith(CANONICAL_SUFFIX):
        raw = raw[: -len(CANONICAL_SUFFIX)].strip()
    # Drop anything after " | " so sub-titles stay clean.
    if ' | ' in raw:
        raw = raw.split(' | ', 1)[0].strip()
    return raw or 'Oasis of Change'


def is_redirect_stub(html_text: str) -> bool:
    return bool(re.search(r'<meta\s+http-equiv=["\']refresh["\']', html_text, re.I))


def wrap_title(title: str, font, max_width: int, draw) -> list[str]:
    words = title.split()
    lines, line = [], ''
    for w in words:
        candidate = (line + ' ' + w).strip()
        if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    if len(lines) > 4:
        lines = lines[:4]
        last = lines[-1]
        while last and draw.textbbox((0, 0), last + '…', font=font)[2] > max_width:
            last = last[:-1]
        lines[-1] = last + '…'
    return lines


def paste_logo(canvas: Image.Image, y: int) -> None:
    if not LOGO_PATH.exists():
        return
    logo = Image.open(LOGO_PATH).convert('RGB')
    # Scale to target height
    ratio = LOGO_TARGET_HEIGHT / logo.height
    new_size = (int(logo.width * ratio), LOGO_TARGET_HEIGHT)
    logo = logo.resize(new_size, Image.LANCZOS)
    canvas.paste(logo, (PADDING_X, y))


def render_og(title: str, out_path: Path) -> None:
    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Left accent bar — the single brand gesture
    draw.rectangle([(0, 0), (ACCENT_BAR_WIDTH, H)], fill=ACCENT)

    # Logo lockup, top-left
    logo_y = PADDING_X  # same padding top
    paste_logo(img, logo_y)

    # Title block — auto-fit type size so at most 4 lines
    divider_y = logo_y + LOGO_TARGET_HEIGHT + 36
    max_text_width = W - PADDING_X * 2
    for size in (88, 80, 72, 64, 56, 50):
        title_font = load_font(FONT_BOLD_CANDIDATES, size)
        lines = wrap_title(title, title_font, max_text_width, draw)
        if len(lines) <= 4:
            break

    ascent, descent = title_font.getmetrics()
    line_h = ascent + descent + 8
    block_h = line_h * len(lines)

    # Vertically centre the title between the divider and the footer baseline
    footer_y = H - PADDING_X - 28
    region_top = divider_y + 40
    region_bottom = footer_y - 40
    y = region_top + ((region_bottom - region_top - block_h) // 2)
    for ln in lines:
        draw.text((PADDING_X, y), ln, font=title_font, fill=TITLE_COLOR)
        y += line_h

    # Footer wordmark
    foot_font = load_font(FONT_REG_CANDIDATES, 26)
    draw.text((PADDING_X, footer_y), 'oasisofchange.com', font=foot_font, fill=MUTED)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, 'PNG', optimize=True)


def inject_meta(html_text: str, og_url: str) -> str:
    og_tag = f'<meta property="og:image" content="{og_url}">'
    tw_tag = f'<meta name="twitter:image" content="{og_url}">'
    if re.search(r'<meta\s+property=["\']og:image["\']', html_text):
        html_text = re.sub(r'<meta\s+property=["\']og:image["\'][^>]*>', og_tag, html_text, count=1)
    else:
        html_text = re.sub(r'</head>', f'    {og_tag}\n</head>', html_text, count=1)
    if re.search(r'<meta\s+name=["\']twitter:image["\']', html_text):
        html_text = re.sub(r'<meta\s+name=["\']twitter:image["\'][^>]*>', tw_tag, html_text, count=1)
    else:
        html_text = re.sub(r'</head>', f'    {tw_tag}\n</head>', html_text, count=1)
    return html_text


def main():
    if not PUBLIC.exists():
        print(f'ERROR: {PUBLIC} not found. Run build.py first.', file=sys.stderr)
        sys.exit(1)

    OG_DIR.mkdir(parents=True, exist_ok=True)
    html_files = sorted(p for p in PUBLIC.rglob('*.html') if p.is_file())

    generated = 0
    skipped = 0
    for html_file in html_files:
        content = html_file.read_text(encoding='utf-8')
        if is_redirect_stub(content):
            skipped += 1
            continue
        title = page_title(content)
        slug = slug_for(html_file)
        og_file = OG_DIR / f'{slug}.png'
        render_og(title, og_file)
        og_url = f'{SITE_BASE}/images/og/{slug}.png'
        new_content = inject_meta(content, og_url)
        if new_content != content:
            html_file.write_text(new_content, encoding='utf-8')
        generated += 1

    print(f'Generated {generated} OG image(s) -> {OG_DIR.relative_to(ROOT)}'
          + (f' ({skipped} redirect stub(s) skipped)' if skipped else ''))


if __name__ == '__main__':
    main()
