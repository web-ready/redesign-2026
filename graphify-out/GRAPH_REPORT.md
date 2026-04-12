# Graph Report - .  (2026-04-11)

## Corpus Check
- 43 files · ~82,346 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 115 nodes · 108 edges · 23 communities detected
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Oasis of Change Inc.` - 9 edges
2. `Oasis of Change Icon Logo (SVG)` - 7 edges
3. `Blog Page` - 6 edges
4. `Graph Report (2026-04-11)` - 5 edges
5. `Gabriel Dalton` - 5 edges
6. `Oasis of Change, Inc.` - 4 edges
7. `Mittler Senior Technology` - 4 edges
8. `Gabriel Dalton TEDx Talk Photo` - 4 edges
9. `About Page` - 4 edges
10. `initMobileNav()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Gabriel Dalton` --conceptually_related_to--> `AI Literacy (TEDx Talk Topic)`  [INFERRED]
  graphify-out/GRAPH_REPORT.md → public/images/about/Gabriel_Dalton_TEDx_Talk.webp
- `Blog - Nonprofit Team Financial Review Photo` --conceptually_related_to--> `Blog Page`  [INFERRED]
  public/images/blog/blog-ai-network-visualization.webp → graphify-out/GRAPH_REPORT.md
- `Blog - Young Person Portrait (Assistive Technology)` --conceptually_related_to--> `Blog Page`  [INFERRED]
  public/images/blog/blog-assistive-technology.webp → graphify-out/GRAPH_REPORT.md
- `Blog - Design Portfolio / Art Book Review Photo` --conceptually_related_to--> `Blog Page`  [INFERRED]
  public/images/blog/blog-data-center-hardware.webp → graphify-out/GRAPH_REPORT.md
- `Blog - Modern Lounge Interior Photo` --conceptually_related_to--> `Blog Page`  [INFERRED]
  public/images/blog/blog-minimal-website-design.webp → graphify-out/GRAPH_REPORT.md

## Hyperedges (group relationships)
- **About Page Hero Section Visual Assets** — about_page_block_1, about_page_block_2, gabriel_dalton_portrait, entity_oasis_of_change, page_about [EXTRACTED 1.00]
- **Gabriel Dalton Public Presence** — gabriel_dalton_portrait, gabriel_dalton_tedx_talk, entity_gabriel_dalton, entity_tedx, concept_ai_literacy [INFERRED 0.80]
- **MST Website Before/After Case Study Comparison** — mst_before_redesign, mst_after_redesign, entity_mittler_senior_technology, entity_oasis_of_change, page_mst_case_study [EXTRACTED 1.00]
- **Favicon Brand Identity Set** — favicon_android_chrome_192, favicon_android_chrome_512, favicon_apple_touch_icon, favicon_16x16, favicon_32x32, oasis_of_change_icon [INFERRED 0.90]
- **Partner Organizations Network** — org_oasis_of_change, org_stanley_park_ecology, org_sustainable_www, org_wesn, org_tree_nation [INFERRED 0.80]
- **Tree Planting Initiative Ecosystem** — org_oasis_of_change, org_tree_nation, initiative_tree_planting, impact_dashboard_mockup, mangrove_tree [INFERRED 0.75]

## Communities

### Community 0 - "Brand & Partnerships"
Cohesion: 0.11
Nodes (21): City of Vancouver, Favicon 16x16, Favicon 32x32, Android Chrome Favicon 192x192, Android Chrome Favicon 512x512, Apple Touch Icon, Impact Dashboard Mockup - Tree Transparency Report, Tree Planting Initiative (17,001 Trees) (+13 more)

### Community 1 - "Founder & Case Studies"
Cohesion: 0.18
Nodes (16): About Page Hero - Person Working on Laptop, About Page - Founded in 2024 Image, AI Literacy (TEDx Talk Topic), Oasis of Change Founded in 2024, Gabriel Dalton, Mittler Senior Technology, Oasis of Change, Inc., TEDx (+8 more)

### Community 2 - "Site JS Components"
Cohesion: 0.22
Nodes (3): initMobileNav(), injectMobileNavFocusStyles(), injectMobileNavScrollbarStyles()

### Community 3 - "CSS Supplement Generator"
Cohesion: 0.2
Nodes (5): fv(), mq(), Generates CSS supplement for missing Tailwind classes and writes it to tailwind., focus-visible variant., Responsive breakpoint variant.

### Community 4 - "CSS Audit Tool"
Cohesion: 0.29
Nodes (7): extract_css_classes(), extract_html_classes(), Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML, Extract all class names used in HTML files., Convert CSS-escaped identifier to plain text., Extract all Tailwind utility class names from a minified CSS file., unescape_css_ident()

### Community 5 - "Dead CSS Cleanup"
Cohesion: 0.33
Nodes (5): delete_dead_from_css(), Phase 0 — ADD:    Append the 3 classes that were always missing (found in HTML,, For each dead class:       - If it appears as the sole selector in a rule → remo, Tailwind class name → escaped CSS identifier (after the dot)., tw_to_css_ident()

### Community 6 - "Blog Content"
Cohesion: 0.29
Nodes (7): Blog - Nonprofit Team Financial Review Photo, Blog - Young Person Portrait (Assistive Technology), Blog - Design Portfolio / Art Book Review Photo, Blog - Modern Lounge Interior Photo, Blog - E-Commerce Browsing Photo, Blog - Strategic Planning Whiteboard Photo, Blog Page

### Community 7 - "Graphify Config"
Cohesion: 0.4
Nodes (5): CLAUDE.md Project Configuration, Graphify Knowledge Graph, Graphify Rebuild Code Command, Rationale: Navigate Wiki Instead of Raw Files, Rationale: Rebuild Graph After Code Modifications

### Community 8 - "Image Comparison Widget"
Cohesion: 0.67
Nodes (2): updateActiveLabels(), updateCompare()

### Community 9 - "Shadow Fix Script"
Cohesion: 0.5
Nodes (3): escape_selector(), Append the 3 corrected shadow rules with proper CSS comma escaping (\2c space)., Convert a Tailwind class name to a CSS-escaped selector class string.

### Community 10 - "Page-Specific Optimizer"
Cohesion: 0.5
Nodes (3): edit(), Page-specific Tailwind class inheritance optimizations. Targets: metric stat car, Replace old with new in file, return True if changed.

### Community 11 - "Class Optimizer"
Cohesion: 0.67
Nodes (1): Bulk Tailwind CSS class optimization across all 34 HTML files.  Optimizations:

### Community 12 - "Accordion Panel JS"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Skip Link CSS"
Cohesion: 1.0
Nodes (1): Add the missing focus: CSS rules for the skip-to-content accessibility link.

### Community 14 - "CSS Cleaner"
Cohesion: 1.0
Nodes (1): Cleans tailwind.min.css: 1. Removes the 3 incorrectly-encoded shadow rules (used

### Community 15 - "Class Verifier"
Cohesion: 1.0
Nodes (1): Precisely verify which 'unused' CSS classes actually appear in HTML class attrib

### Community 16 - "Nav Scanner"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Nav Report Generator"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Nav Pattern Extractor"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Vancouver Partnerships"
Cohesion: 1.0
Nodes (1): Community: Vancouver Partnerships & Sustainability

### Community 20 - "Oasis Identity"
Cohesion: 1.0
Nodes (1): Community: Oasis of Change Identity

### Community 21 - "Blog Content Hub"
Cohesion: 1.0
Nodes (1): Community: Blog Content

### Community 22 - "MST Case Study"
Cohesion: 1.0
Nodes (1): Community: MST Case Study

## Knowledge Gaps
- **42 isolated node(s):** `Add the missing focus: CSS rules for the skip-to-content accessibility link.`, `Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML`, `Convert CSS-escaped identifier to plain text.`, `Extract all Tailwind utility class names from a minified CSS file.`, `Extract all class names used in HTML files.` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Accordion Panel JS`** (2 nodes): `832338.js`, `showPanel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skip Link CSS`** (2 nodes): `add_skip_link_css.py`, `Add the missing focus: CSS rules for the skip-to-content accessibility link.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CSS Cleaner`** (2 nodes): `clean_css.py`, `Cleans tailwind.min.css: 1. Removes the 3 incorrectly-encoded shadow rules (used`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Class Verifier`** (2 nodes): `verify_classes.py`, `Precisely verify which 'unused' CSS classes actually appear in HTML class attrib`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Scanner`** (1 nodes): `comprehensive_nav_scan.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Report Generator`** (1 nodes): `detailed_nav_report.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Pattern Extractor`** (1 nodes): `get_nav_patterns.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vancouver Partnerships`** (1 nodes): `Community: Vancouver Partnerships & Sustainability`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Oasis Identity`** (1 nodes): `Community: Oasis of Change Identity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blog Content Hub`** (1 nodes): `Community: Blog Content`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `MST Case Study`** (1 nodes): `Community: MST Case Study`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graph Report (2026-04-11)` connect `Founder & Case Studies` to `Graphify Config`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Oasis of Change Inc.` (e.g. with `Tree-Nation Partnership Banner` and `Stanley Park Ecology Society`) actually correct?**
  _`Oasis of Change Inc.` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `Oasis of Change Icon Logo (SVG)` (e.g. with `Android Chrome Favicon 192x192` and `Android Chrome Favicon 512x512`) actually correct?**
  _`Oasis of Change Icon Logo (SVG)` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Blog Page` (e.g. with `Blog - Nonprofit Team Financial Review Photo` and `Blog - Young Person Portrait (Assistive Technology)`) actually correct?**
  _`Blog Page` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Gabriel Dalton` (e.g. with `Oasis of Change, Inc.` and `AI Literacy (TEDx Talk Topic)`) actually correct?**
  _`Gabriel Dalton` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Add the missing focus: CSS rules for the skip-to-content accessibility link.`, `Audit Tailwind CSS classes: compare what's defined in CSS vs what's used in HTML`, `Convert CSS-escaped identifier to plain text.` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Brand & Partnerships` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._