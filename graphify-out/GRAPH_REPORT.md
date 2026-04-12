# Graph Report - .  (2026-04-12)

## Corpus Check
- 96 files · ~275,200 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 188 nodes · 232 edges · 26 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 55 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Oasis of Change - Founded 2024` - 13 edges
2. `Oasis of Change Brand Identity` - 8 edges
3. `buildDesktopSwitcher()` - 6 edges
4. `inject()` - 6 edges
5. `Oasis of Change - About Page Section` - 6 edges
6. `findLang()` - 5 edges
7. `initDesktopDropdown()` - 5 edges
8. `switchTo()` - 5 edges
9. `Oasis of Change Brand Logo` - 5 edges
10. `PWA Icon Set â€“ Oasis of Change` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Gabriel Dalton` --FOUNDER_OF--> `Oasis of Change - Founded 2024`  [INFERRED]
  public/images/about/Gabriel-Dalton.webp → public/images/about/about-page-block-2.webp
- `Web Ready (sustainable web design brand/tool)` --BRAND_OF--> `Oasis of Change - Founded 2024`  [INFERRED]
  public/images/logo/web-ready-logo.webp → public/images/about/about-page-block-2.webp
- `Oasis of Change - Founded 2024` --PARTNERS_WITH--> `Stanley Park Ecology Society`  [INFERRED]
  public/images/about/about-page-block-2.webp → public/images/partners/stanley-park-ecology-society-logo.webp
- `Oasis of Change - Founded 2024` --PARTNERS_WITH--> `Sustainable WWW`  [INFERRED]
  public/images/about/about-page-block-2.webp → public/images/partners/sustainable-www-logo.webp
- `Oasis of Change - Founded 2024` --PARTNERS_WITH--> `West End Seniors' Network (WESN)`  [INFERRED]
  public/images/about/about-page-block-2.webp → public/images/partners/WESN-Colour-Logo-scaled.webp

## Hyperedges (group relationships)
- **Mittler Senior Technology Case Study Asset Group** —  [EXTRACTED 1.00]

## Communities

### Community 0 - "i18n Language Switching"
Cohesion: 0.19
Nodes (20): buildDesktopSwitcher(), buildMobileSwitcher(), checkSvg(), chevronSvg(), closeDropdown(), findLang(), getUrlLang(), globeSvg() (+12 more)

### Community 1 - "CSS Audit and Config"
Cohesion: 0.12
Nodes (21): CSS Audit Script, CLAUDE.md Project Configuration, Console Easter Egg (Curious Coder), Curated Translation Dictionary, Custom/JS-Injected Classes Allowlist, Google Translate Integration, Graph Report (2026-04-11), i18n Language Switcher Module (+13 more)

### Community 2 - "Brand and Sustainability Assets"
Cohesion: 0.12
Nodes (20): Web Ready (sustainable web design brand/tool), Impact Dashboard Mockup - Tree Transparency Report showing 17,001 trees planted with partner stats and climate outcomes, Photograph of mangrove trees with visible aerial root systems in a tropical coastal environment, Oasis of Change icon-only SVG logo (860x900 vector mark without wordmark), Oasis of Change official full SVG logo with wordmark (6000x1194 wide-format vector), Stanley Park Ecology Society logo with green sphere and black text, Official City of Vancouver Proclamation declaring October 20-25, 2025 as Sustainable Technology Week, signed by Mayor Ken Sim, Sustainable WWW logo with leaf icon in circle and bold black text (+12 more)

### Community 3 - "About Page and Founder Story"
Cohesion: 0.16
Nodes (16): TEDx Talk on AI Literacy, About Page Block 1 - Professional with Laptop, About Page Block 2 - Founded in 2024 with Person Browsing Website, Blog Image - Two People Reviewing Documents at Desk, Blog Image - Young Woman in Neutral Setting for Assistive Technology Topic, Blog Image - Person Browsing Design Book on Side Table, Blog Image - Modern Minimalist Lobby with Black Lounge Chairs, Gabriel Dalton Black-and-White Headshot Portrait (+8 more)

### Community 4 - "About Page Editorial"
Cohesion: 0.29
Nodes (11): Black Man with Glasses in Cardigan - Contemplative Pose with Laptop, About Page Block 1 - Thoughtful Professional at Laptop, About Page Block 2 - Founded in 2024 Stat Card with Woman at Laptop, Founding Year 2024 - Text Overlay Stat Card, Woman with Beanie Working on Laptop at Cafe Table, Gabriel Dalton - Black-and-White Headshot Portrait, Gabriel Dalton - Founder of Oasis of Change, TEDx Speaker - Gabriel Dalton Presenting on Stage with Headset Mic (+3 more)

### Community 5 - "CSS Generation Tools"
Cohesion: 0.2
Nodes (5): fv(), mq(), Generates CSS supplement for missing Tailwind classes and writes it to tailwind., focus-visible variant., Responsive breakpoint variant.

### Community 6 - "Brand Color System"
Cohesion: 0.33
Nodes (10): Brand Color: Deep Blue (#3246a1), Brand Color: Bright Green (#3bb63e), Brand Color: Forest Green (#2f8b3b), Brand Color: Sky Blue (#4493d6), Oasis of Change Brand Identity, Brand Motif: Seedling / Growth Icon, Brand Typography: Display All-Caps Sans/Slab, Oasis of Change Icon Mark (SVG) (+2 more)

### Community 7 - "Impact Metrics and Transparency"
Cohesion: 0.33
Nodes (9): CO2 Offset Metric (545,831+), Oasis of Change Inc. Dashboard Branding, Tree Transparency Report Dashboard, Coastal Mangrove Reforestation Site, Mangrove Tree Ecosystem, Oasis of Change Civic Recognition for Sustainability Leadership, Sustainable Technology Week Proclamation, Oasis of Change and Tree-Nation Collaboration (+1 more)

### Community 8 - "CSS Class Auditing"
Cohesion: 0.29
Nodes (7): extract_css_classes(), extract_html_classes(), Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML, Extract all class names used in HTML files., Convert CSS-escaped identifier to plain text., Extract all Tailwind utility class names from a minified CSS file., unescape_css_ident()

### Community 9 - "Site JS Interactivity"
Cohesion: 0.29
Nodes (0): 

### Community 10 - "CSS Cleanup and Testing"
Cohesion: 0.33
Nodes (5): delete_dead_from_css(), Phase 0 — ADD:    Append the 3 classes that were always missing (found in HTML,, For each dead class:       - If it appears as the sole selector in a rule → remo, Tailwind class name → escaped CSS identifier (after the dot)., tw_to_css_ident()

### Community 11 - "Favicon and PWA Icons"
Cohesion: 0.62
Nodes (7): Android Chrome Icon 192x192 â€“ Oasis of Change Logo, Android Chrome Icon 512x512 â€“ Oasis of Change Logo, Apple Touch Icon â€“ Oasis of Change Logo, Favicon 16x16 â€“ Oasis of Change, Favicon 32x32 â€“ Oasis of Change, Oasis of Change Brand Logo, PWA Icon Set â€“ Oasis of Change

### Community 12 - "Case Studies Portfolio"
Cohesion: 0.6
Nodes (5): Denman Case Study, Mittler Case Study, Denman Case Study Preview â€” Abstract Ink/Paint Art, Jordan Mittler â€” Portrait Photo, Mittler Case Study Preview â€” Couple at Vineyard/Countryside

### Community 13 - "Mittler Redesign Project"
Cohesion: 0.6
Nodes (5): Mittler Senior Technology Hero Background, Mittler Senior Tech Before/After Redesign Comparison, Mittler Senior Technology Website After Redesign, Mittler Senior Technology Website Before Redesign, Nature Sustainability Case Study Hero

### Community 14 - "Range Slider Component"
Cohesion: 0.67
Nodes (2): updateActiveLabels(), updateCompare()

### Community 15 - "Shadow CSS Fixes"
Cohesion: 0.5
Nodes (3): escape_selector(), Append the 3 corrected shadow rules with proper CSS comma escaping (\2c space)., Convert a Tailwind class name to a CSS-escaped selector class string.

### Community 16 - "Page-Specific Optimization"
Cohesion: 0.5
Nodes (3): edit(), Page-specific Tailwind class inheritance optimizations. Targets: metric stat car, Replace old with new in file, return True if changed.

### Community 17 - "Partner Organizations"
Cohesion: 1.0
Nodes (4): West End Seniors' Network, Oasis of Change Partner Organizations, Stanley Park Ecology Society, Sustainable WWW

### Community 18 - "Class Optimization"
Cohesion: 0.67
Nodes (1): Bulk Tailwind CSS class optimization across all 34 HTML files.  Optimizations:

### Community 19 - "Panel Carousel JS"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Skip Link Accessibility"
Cohesion: 1.0
Nodes (1): Add the missing focus: CSS rules for the skip-to-content accessibility link.

### Community 21 - "CSS Cleaning"
Cohesion: 1.0
Nodes (1): Cleans tailwind.min.css: 1. Removes the 3 incorrectly-encoded shadow rules (used

### Community 22 - "Class Verification"
Cohesion: 1.0
Nodes (1): Precisely verify which 'unused' CSS classes actually appear in HTML class attrib

### Community 23 - "Nav Scan Analysis"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Nav Report Generation"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Nav Pattern Detection"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **35 isolated node(s):** `Add the missing focus: CSS rules for the skip-to-content accessibility link.`, `Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML`, `Convert CSS-escaped identifier to plain text.`, `Extract all Tailwind utility class names from a minified CSS file.`, `Extract all class names used in HTML files.` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Panel Carousel JS`** (2 nodes): `832338.js`, `showPanel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skip Link Accessibility`** (2 nodes): `add_skip_link_css.py`, `Add the missing focus: CSS rules for the skip-to-content accessibility link.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CSS Cleaning`** (2 nodes): `clean_css.py`, `Cleans tailwind.min.css: 1. Removes the 3 incorrectly-encoded shadow rules (used`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Class Verification`** (2 nodes): `verify_classes.py`, `Precisely verify which 'unused' CSS classes actually appear in HTML class attrib`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Scan Analysis`** (1 nodes): `comprehensive_nav_scan.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Report Generation`** (1 nodes): `detailed_nav_report.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Pattern Detection`** (1 nodes): `get_nav_patterns.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Oasis of Change - Founded 2024` connect `Brand and Sustainability Assets` to `About Page and Founder Story`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `About Page Block 2 - Founded in 2024 with Person Browsing Website` connect `About Page and Founder Story` to `Brand and Sustainability Assets`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Oasis of Change - Founded 2024` (e.g. with `Gabriel Dalton` and `Web Ready (sustainable web design brand/tool)`) actually correct?**
  _`Oasis of Change - Founded 2024` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Oasis of Change Brand Identity` (e.g. with `Web Ready Logo Badge (WebP)` and `Brand Motif: Seedling / Growth Icon`) actually correct?**
  _`Oasis of Change Brand Identity` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Add the missing focus: CSS rules for the skip-to-content accessibility link.`, `Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML`, `Convert CSS-escaped identifier to plain text.` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CSS Audit and Config` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Brand and Sustainability Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._