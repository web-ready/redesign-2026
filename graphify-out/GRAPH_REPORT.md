# Graph Report - .  (2026-04-12)

## Corpus Check
- 96 files · ~276,410 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 175 nodes · 210 edges · 22 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Oasis of Change - Founded 2024` - 15 edges
2. `Case Studies Landing Page` - 12 edges
3. `buildDesktopSwitcher()` - 6 edges
4. `inject()` - 6 edges
5. `Mittler Senior Technology` - 6 edges
6. `findLang()` - 5 edges
7. `initDesktopDropdown()` - 5 edges
8. `switchTo()` - 5 edges
9. `Case Studies Page - Desktop V3 (Final Card Layout with Dark Theme)` - 5 edges
10. `Secondary Case Study Cards (Two-Column Grid Below Featured)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Oasis of Change Website Rebuild - Sustainability-First` --REFERENCES--> `Oasis of Change - Founded 2024`  [EXTRACTED]
  case-studies-desktop-v3.png → public/images/about/about-page-block-2.webp
- `Case Studies Landing Page` --BELONGS_TO--> `Oasis of Change - Founded 2024`  [EXTRACTED]
  case-studies-desktop-v3.png → public/images/about/about-page-block-2.webp
- `Case Studies Page - Desktop V1 (Initial Layout with Overlapping Text)` --EVOLVED_INTO--> `Case Studies Page - Desktop V2 (Polished Grid Layout)`  [INFERRED]
  case-studies-desktop.png → case-studies-desktop-v2.png
- `Case Studies Page - Desktop V2 (Polished Grid Layout)` --EVOLVED_INTO--> `Case Studies Page - Desktop V3 (Final Card Layout with Dark Theme)`  [INFERRED]
  case-studies-desktop-v2.png → case-studies-desktop-v3.png
- `Case Studies Page - Full Mobile/Narrow Layout (Single Column Stack)` --RESPONSIVE_VARIANT_OF--> `Case Studies Page - Desktop V3 (Final Card Layout with Dark Theme)`  [INFERRED]
  case-studies-full.png → case-studies-desktop-v3.png

## Communities

### Community 0 - "i18n Language Switcher"
Cohesion: 0.17
Nodes (22): applyDictionary(), buildDesktopSwitcher(), buildMobileSwitcher(), checkSvg(), chevronSvg(), closeDropdown(), findLang(), getUrlLang() (+14 more)

### Community 1 - "Site Architecture & Config"
Cohesion: 0.12
Nodes (21): CSS Audit Script, CLAUDE.md Project Configuration, Console Easter Egg (Curious Coder), Curated Translation Dictionary, Custom/JS-Injected Classes Allowlist, Google Translate Integration, Graph Report (2026-04-11), i18n Language Switcher Module (+13 more)

### Community 2 - "Partners & Initiatives"
Cohesion: 0.12
Nodes (20): Web Ready (sustainable web design brand/tool), Impact Dashboard Mockup - Tree Transparency Report showing 17,001 trees planted with partner stats and climate outcomes, Photograph of mangrove trees with visible aerial root systems in a tropical coastal environment, Oasis of Change icon-only SVG logo (860x900 vector mark without wordmark), Oasis of Change official full SVG logo with wordmark (6000x1194 wide-format vector), Stanley Park Ecology Society logo with green sphere and black text, Official City of Vancouver Proclamation declaring October 20-25, 2025 as Sustainable Technology Week, signed by Mayor Ken Sim, Sustainable WWW logo with leaf icon in circle and bold black text (+12 more)

### Community 3 - "Case Studies UI Design"
Cohesion: 0.15
Nodes (18): Denman Place Mall Website Redesign - Faster, Clearer Visitor Experience, Mittler Senior Technology Case Study - 98% Reduction in Carbon, Energy, and Water, Oasis of Change Website Rebuild - Sustainability-First, Card Navigation Arrow Icon (Right Arrow on Hover), Case Studies Page - Desktop V1 (Initial Layout with Overlapping Text), Case Studies Page - Desktop V2 (Polished Grid Layout), Case Studies Page - Desktop V3 (Final Card Layout with Dark Theme), Case Studies Page - Full Mobile/Narrow Layout (Single Column Stack) (+10 more)

### Community 4 - "About & Blog Content"
Cohesion: 0.16
Nodes (16): TEDx Talk on AI Literacy, About Page Block 1 - Professional with Laptop, About Page Block 2 - Founded in 2024 with Person Browsing Website, Blog Image - Two People Reviewing Documents at Desk, Blog Image - Young Woman in Neutral Setting for Assistive Technology Topic, Blog Image - Person Browsing Design Book on Side Table, Blog Image - Modern Minimalist Lobby with Black Lounge Chairs, Gabriel Dalton Black-and-White Headshot Portrait (+8 more)

### Community 5 - "Mittler Case Study Assets"
Cohesion: 0.23
Nodes (14): Technology education for senior citizens, Sustainability and renewable energy, Website redesign (before/after comparison), Case studies images directory, Denman Place Mall case study, Jordan Mittler, Mittler Senior Technology, Case study preview: abstract pastel watercolor texture with teal and orange ink swirls and splatters (+6 more)

### Community 6 - "CSS Supplement Generator"
Cohesion: 0.2
Nodes (5): fv(), mq(), Generates CSS supplement for missing Tailwind classes and writes it to tailwind., focus-visible variant., Responsive breakpoint variant.

### Community 7 - "CSS Audit Script"
Cohesion: 0.29
Nodes (7): extract_css_classes(), extract_html_classes(), Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML, Extract all class names used in HTML files., Convert CSS-escaped identifier to plain text., Extract all Tailwind utility class names from a minified CSS file., unescape_css_ident()

### Community 8 - "Site.js Core Components"
Cohesion: 0.29
Nodes (0): 

### Community 9 - "CSS Test & Delete Script"
Cohesion: 0.33
Nodes (5): delete_dead_from_css(), Phase 0 — ADD:    Append the 3 classes that were always missing (found in HTML,, For each dead class:       - If it appears as the sole selector in a rule → remo, Tailwind class name → escaped CSS identifier (after the dot)., tw_to_css_ident()

### Community 10 - "Image Comparison Widget"
Cohesion: 0.67
Nodes (2): updateActiveLabels(), updateCompare()

### Community 11 - "Shadow Fix Script"
Cohesion: 0.5
Nodes (3): escape_selector(), Append the 3 corrected shadow rules with proper CSS comma escaping (\2c space)., Convert a Tailwind class name to a CSS-escaped selector class string.

### Community 12 - "Page-Specific Optimizer"
Cohesion: 0.5
Nodes (3): edit(), Page-specific Tailwind class inheritance optimizations. Targets: metric stat car, Replace old with new in file, return True if changed.

### Community 13 - "Blog Image Assets"
Cohesion: 0.5
Nodes (4): Blog images directory, Blog image: person browsing e-commerce site on laptop while holding coffee, Blog image: hand placing sticky note labeled FORECAST on whiteboard with planning annotations, Blog image: group of people collaborating at table with laptops in warm rustic workspace

### Community 14 - "Class Optimizer Script"
Cohesion: 0.67
Nodes (1): Bulk Tailwind CSS class optimization across all 34 HTML files.  Optimizations:

### Community 15 - "Audit View Toggle"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Verify Classes Script"
Cohesion: 1.0
Nodes (1): Add the missing focus: CSS rules for the skip-to-content accessibility link.

### Community 17 - "Add Skip Link Script"
Cohesion: 1.0
Nodes (1): Cleans tailwind.min.css: 1. Removes the 3 incorrectly-encoded shadow rules (used

### Community 18 - "Clean CSS Script"
Cohesion: 1.0
Nodes (1): Precisely verify which 'unused' CSS classes actually appear in HTML class attrib

### Community 19 - "Nav Scan Scripts"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Nav Report Script"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Get Nav Patterns Script"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **45 isolated node(s):** `Add the missing focus: CSS rules for the skip-to-content accessibility link.`, `Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML`, `Convert CSS-escaped identifier to plain text.`, `Extract all Tailwind utility class names from a minified CSS file.`, `Extract all class names used in HTML files.` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Audit View Toggle`** (2 nodes): `832338.js`, `showPanel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verify Classes Script`** (2 nodes): `add_skip_link_css.py`, `Add the missing focus: CSS rules for the skip-to-content accessibility link.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Add Skip Link Script`** (2 nodes): `clean_css.py`, `Cleans tailwind.min.css: 1. Removes the 3 incorrectly-encoded shadow rules (used`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Clean CSS Script`** (2 nodes): `verify_classes.py`, `Precisely verify which 'unused' CSS classes actually appear in HTML class attrib`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Scan Scripts`** (1 nodes): `comprehensive_nav_scan.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Report Script`** (1 nodes): `detailed_nav_report.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Nav Patterns Script`** (1 nodes): `get_nav_patterns.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Oasis of Change - Founded 2024` connect `Partners & Initiatives` to `Case Studies UI Design`, `About & Blog Content`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `Case Studies Landing Page` connect `Case Studies UI Design` to `Partners & Initiatives`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `About Page Block 2 - Founded in 2024 with Person Browsing Website` connect `About & Blog Content` to `Partners & Initiatives`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Oasis of Change - Founded 2024` (e.g. with `Gabriel Dalton` and `Web Ready (sustainable web design brand/tool)`) actually correct?**
  _`Oasis of Change - Founded 2024` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Add the missing focus: CSS rules for the skip-to-content accessibility link.`, `Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML`, `Convert CSS-escaped identifier to plain text.` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Site Architecture & Config` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Partners & Initiatives` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._