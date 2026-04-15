"""
Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML.
"""
import re
import os
import glob

CSS_FILE = 'public/css/tailwind/tailwind.min.css'
HTML_DIR = 'public'

# Custom/JS-injected class prefixes and names to exclude from "missing" report
CUSTOM_CLASSES = {
    # Nav dropdown - injected via site.js
    'nav-dd-company-popover', 'nav-dd-icon', 'nav-dd-initiatives-col',
    'nav-dd-initiatives-foot', 'nav-dd-initiatives-popover', 'nav-dd-initiatives-split',
    'nav-dd-initiatives-top', 'nav-dd-kicker', 'nav-dd-link', 'nav-dd-link--init',
    'nav-dd-link-desc', 'nav-dd-link-stack', 'nav-dd-link-title', 'nav-dd-panel',
    'nav-dd-panel--company', 'nav-dd-panel--initiatives',
    # Impact stats - injected via site.js
    'impact-stat', 'impact-stat-label', 'impact-stat-number', 'impact-stats',
    # Ticker/carousel - injected via site.js
    'ticker-fade', 'ticker-fade-left', 'ticker-fade-right', 'ticker-group', 'ticker-track',
    # Site footer - injected via site.js
    'site-footer-brand', 'site-footer-heading', 'site-footer-layout', 'site-footer-link',
    'site-footer-list', 'site-footer-nav', 'site-global-footer',
    # Other custom/JS classes
    'about-hero-image-mobile-hidden', 'bs-section-dragged', 'js-scroll-to-ways', 'skip-to-content',
    # Slider/comparison widget
    'slider', 'slider-2', 'slider-container', 'slide-2',
    # Custom checkbox
    'custom-check', 'custom-checkbox',
    # Body/font custom theme tokens
    'font-body', 'font-heading', 'text-body', 'bg-body',
}


def unescape_css_ident(raw):
    """Convert CSS-escaped identifier to plain text."""
    result = []
    i = 0
    bs = chr(92)
    while i < len(raw):
        if raw[i] == bs and i + 1 < len(raw):
            # Check for hex escape: \XXXXXX (1-6 hex digits, optional trailing space)
            j = i + 1
            while j < len(raw) and raw[j] in '0123456789abcdefABCDEF' and j < i + 7:
                j += 1
            if j > i + 1:
                result.append(chr(int(raw[i+1:j], 16)))
                i = j
                if i < len(raw) and raw[i] == ' ':
                    i += 1
            else:
                # Single char escape like \: \/ \[ \] \( \) \. \,
                result.append(raw[i + 1])
                i += 2
        else:
            result.append(raw[i])
            i += 1
    return ''.join(result)


def extract_css_classes(css_file):
    """Extract all Tailwind utility class names from a minified CSS file."""
    with open(css_file, encoding='utf-8') as f:
        css = f.read()

    classes = set()
    bs = chr(92)

    # Split by { to get selector parts
    parts = css.split('{')
    for part in parts:
        # The selector is after the last } in the part
        sel = part.split('}')[-1]

        # Find all .classname patterns.
        # A CSS class ident can contain: alphanumeric, -, _
        # OR a backslash followed by ANY character (escape sequence)
        # We want to capture the full escaped class name.
        i = 0
        while i < len(sel):
            if sel[i] == '.':
                # Start of a class selector - read until we hit a non-class char
                j = i + 1
                while j < len(sel):
                    c = sel[j]
                    if c == bs and j + 1 < len(sel):
                        # Backslash escape - skip 2 chars (or more for hex)
                        j += 1
                        # Check for hex escape
                        hex_start = j
                        while j < len(sel) and sel[j] in '0123456789abcdefABCDEF' and j < hex_start + 6:
                            j += 1
                        if j > hex_start:
                            # was a hex escape, skip optional trailing space
                            if j < len(sel) and sel[j] == ' ':
                                j += 1
                        else:
                            j += 1  # single char escape
                    elif c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_':
                        j += 1
                    else:
                        break

                raw_class = sel[i+1:j]
                if raw_class:
                    unesc = unescape_css_ident(raw_class)
                    classes.add(unesc)
                i = j
            else:
                i += 1

    return classes


def extract_html_classes(html_dir):
    """Extract all class names used in HTML files."""
    classes = set()
    html_files = glob.glob(os.path.join(html_dir, '*.html'))
    for html_file in html_files:
        with open(html_file, encoding='utf-8') as f:
            content = f.read()
        for m in re.finditer(r'class(?:Name)?=["\']([^"\']+)["\']', content):
            for cls in m.group(1).split():
                cls = cls.strip()
                if cls:
                    classes.add(cls)
    return classes


if __name__ == '__main__':
    css_classes = extract_css_classes(CSS_FILE)
    html_classes = extract_html_classes(HTML_DIR)

    print(f"CSS defines: {len(css_classes)} classes")
    print(f"HTML uses:   {len(html_classes)} classes")

    missing_raw = html_classes - css_classes

    # Separate custom (JS-injected) from true Tailwind gaps
    missing_custom = sorted(c for c in missing_raw if c in CUSTOM_CLASSES)
    missing_tailwind = sorted(c for c in missing_raw if c not in CUSTOM_CLASSES)

    print(f"\n=== MISSING TAILWIND CLASSES FROM CSS ({len(missing_tailwind)}) ===")
    print("(used in HTML but no matching CSS rule - visually broken)")
    for cls in missing_tailwind:
        print(f"  {cls}")

    print(f"\n=== CUSTOM/JS-INJECTED CLASSES NOT IN CSS ({len(missing_custom)}) ===")
    print("(expected - these are styled elsewhere)")
    for cls in missing_custom:
        print(f"  {cls}")

    unused_raw = css_classes - html_classes
    # Filter out garbage fragments from extraction
    unused_clean = sorted(
        c for c in unused_raw
        if len(c) > 3
        and not c[0].isdigit()
        and '_' not in c[:2]
        and c not in CUSTOM_CLASSES
    )
    print(f"\n=== IN CSS BUT NOT USED IN HTML ({len(unused_clean)} filtered) ===")
    for cls in unused_clean[:80]:
        print(f"  {cls}")
    if len(unused_clean) > 80:
        print(f"  ... and {len(unused_clean)-80} more")
