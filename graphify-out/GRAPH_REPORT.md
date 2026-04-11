# Graph Report - .  (2026-04-11)

## Corpus Check
- 30 files · ~437,818 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 84 nodes · 125 edges · 9 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Oasis of Change, Inc.` - 9 edges
2. `Oasis of Change, Inc.` - 8 edges
3. `Oasis of Change` - 7 edges
4. `Oasis of Change Icon (SVG)` - 7 edges
5. `Design Portfolio / Art Book Review Photo` - 6 edges
6. `Modern Lounge Interior Photo` - 5 edges
7. `Business Consultation / Financial Review Photo` - 5 edges
8. `Gabriel Dalton` - 5 edges
9. `Sustainable Technology Week Proclamation` - 5 edges
10. `Oasis of Change Brand Identity` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Apple Touch Icon` --represents_brand_of--> `Oasis of Change, Inc.`  [INFERRED]
  public/images/favicon/apple-touch-icon.png → public/images/favicon/site.webmanifest
- `Favicon 16x16` --represents_brand_of--> `Oasis of Change, Inc.`  [INFERRED]
  public/images/favicon/favicon-16x16.png → public/images/favicon/site.webmanifest
- `Green Leaves Growth Motif` --is_visual_element_of--> `Oasis of Change Brand Identity`  [INFERRED]
  public/images/favicon/android-chrome-512x512.png → public/images/favicon/site.webmanifest
- `Blue Water/Oasis Motif` --is_visual_element_of--> `Oasis of Change Brand Identity`  [INFERRED]
  public/images/favicon/android-chrome-512x512.png → public/images/favicon/site.webmanifest
- `Etymology of 'Oasis of Change' Diagram` --LIKELY_INTENDED_FOR--> `About Page`  [INFERRED]
  public/images/etymology-image.png → public/about.html

## Hyperedges (group relationships)
- **** — picture4_modern_lounge_interior, picture5_business_consultation, picture6_ecommerce_browsing, picture8_design_portfolio_review, picture9_portrait_young_woman, picture10_strategic_planning_whiteboard [EXTRACTED 1.00]
- **** — picture4_modern_lounge_interior, picture5_business_consultation, picture6_ecommerce_browsing [EXTRACTED 1.00]
- **** — picture8_design_portfolio_review, picture9_portrait_young_woman, picture10_strategic_planning_whiteboard [EXTRACTED 1.00]
- **hyper_mst_before_after_comparison** — mst-website-before_screenshot, mst-website-after_screenshot, entity_mittler_senior_technology, entity_oasis_of_change, page_mst_case_study [EXTRACTED 1.00]
- **hyper_about_page_hero_section** — about-page-block-1_stock_photo_person_laptop, about-page-block-2_founded_2024, gabriel-dalton_portrait, entity_oasis_of_change, page_about [EXTRACTED 1.00]
- **hyper_gabriel_dalton_public_presence** — gabriel-dalton_portrait, gabriel-dalton_tedx_talk, entity_gabriel_dalton, entity_tedx [INFERRED 0.80]
- **** — favicon_android_chrome_192, favicon_android_chrome_512, favicon_apple_touch_icon, favicon_16x16, favicon_32x32 [INFERRED 0.90]
- **** — logo_oasis_icon_svg, logo_oasis_official_svg, favicon_android_chrome_192, favicon_android_chrome_512, favicon_apple_touch_icon, favicon_16x16, favicon_32x32 [INFERRED 0.85]
- **** — visual_motif_leaves, visual_motif_water [EXTRACTED 1.00]

## Communities

### Community 0 - "Vancouver Partnerships & Sustainability"
Cohesion: 0.22
Nodes (15): City of Vancouver, Impact Dashboard Mockup (Tree Transparency Report), Ken Sim (Mayor of Vancouver), Low-Carbon Web Design, Oasis of Change, Inc., Stanley Park Ecology Society, Stanley Park Ecology Society Logo, Sustainable Technology Week (Oct 20-27, 2025) (+7 more)

### Community 1 - "Oasis of Change Identity"
Cohesion: 0.22
Nodes (14): About Page Hero - Person Working on Laptop, About Page - Founded in 2024 Image, Gabriel Dalton, Oasis of Change, TEDx, Tree-Nation, Etymology of 'Oasis of Change' Diagram, Gabriel Dalton Portrait Photo (+6 more)

### Community 2 - "Site UI Components"
Cohesion: 0.18
Nodes (3): initMobileNav(), injectMobileNavFocusStyles(), injectMobileNavScrollbarStyles()

### Community 3 - "Brand Assets & Logo"
Cohesion: 0.33
Nodes (12): Oasis of Change Brand Identity, Favicon 16x16, Favicon 32x32, Android Chrome Icon 192x192, Android Chrome Icon 512x512, Apple Touch Icon, Oasis of Change Icon (SVG), Oasis of Change Official Logo (SVG) (+4 more)

### Community 4 - "Graphify Configuration"
Cohesion: 0.27
Nodes (10): GRAPH_REPORT.md, Graphify Configuration, Graphify Knowledge Graph, graphify.watch._rebuild_code, Rationale: Navigate Wiki Instead of Raw Files, Rationale: Read GRAPH_REPORT.md Before Answering Architecture Questions, Rationale: Rebuild Graph After Code Modifications, Graphify Rebuild Code Command (+2 more)

### Community 5 - "Blog Content"
Cohesion: 0.49
Nodes (10): Blog Assets Directory, Latest Blog Posts Section, Blog Page, Blog Resources Section, Strategic Planning Whiteboard Photo, Modern Lounge Interior Photo, Business Consultation / Financial Review Photo, E-Commerce Browsing Photo (+2 more)

### Community 6 - "Comparison Slider"
Cohesion: 0.67
Nodes (2): updateActiveLabels(), updateCompare()

### Community 7 - "MST Case Study"
Cohesion: 0.83
Nodes (4): Mittler Senior Technology, Mittler Senior Technology Website - After Redesign Screenshot, Mittler Senior Technology Website - Before Redesign Screenshot, Mittler Senior Technology Case Study Page

### Community 8 - "Panel Component"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **10 isolated node(s):** `Rationale: Read GRAPH_REPORT.md Before Answering Architecture Questions`, `Rationale: Navigate Wiki Instead of Raw Files`, `Rationale: Rebuild Graph After Code Modifications`, `Tree Planting Page`, `Homepage` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Panel Component`** (2 nodes): `832338.js`, `showPanel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Oasis of Change` connect `Oasis of Change Identity` to `MST Case Study`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Oasis of Change, Inc.` (e.g. with `Apple Touch Icon` and `Favicon 16x16`) actually correct?**
  _`Oasis of Change, Inc.` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Oasis of Change, Inc.` (e.g. with `Stanley Park Ecology Society` and `West End Seniors' Network (WESN)`) actually correct?**
  _`Oasis of Change, Inc.` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `Oasis of Change Icon (SVG)` (e.g. with `Android Chrome Icon 512x512` and `Favicon 32x32`) actually correct?**
  _`Oasis of Change Icon (SVG)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Design Portfolio / Art Book Review Photo` (e.g. with `Business Consultation / Financial Review Photo` and `Modern Lounge Interior Photo`) actually correct?**
  _`Design Portfolio / Art Book Review Photo` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Rationale: Read GRAPH_REPORT.md Before Answering Architecture Questions`, `Rationale: Navigate Wiki Instead of Raw Files`, `Rationale: Rebuild Graph After Code Modifications` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._