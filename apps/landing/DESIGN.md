---
name: Techosoul UI Landing
description: The marketing landing page for Techosoul UI, drawn as a collider event display in which one synthetic payment's tracks curve out to the components that show it.
colors:
  vacuum: "#070b12"
  vacuum-raised: "#0a101a"
  detector-steel: "#0f1827"
  ring-blue: "#2e4a72"
  ring-blue-lit: "#4a6fa3"
  hairline: "#1a283f"
  hairline-strong: "#263a5a"
  readout-white: "#edf2fb"
  muted-steel: "#adbad0"
  dim-steel: "#8396b3"
  signal-primary: "#91b5ff"
  signal-positive: "#70dfb2"
  signal-negative: "#ff9baa"
  signal-warning: "#f2cd7e"
  signal-info: "#becaff"
  action-blue: "#3268dc"
  action-blue-deep: "#285ac5"
typography:
  display:
    fontFamily: "Saira Variable, Segoe UI, sans-serif"
    fontSize: "clamp(34px, 3.5vw, 54px)"
    fontWeight: 620
    lineHeight: 1
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Saira Variable, Segoe UI, sans-serif"
    fontSize: "clamp(30px, 3.5vw, 54px)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Saira Variable, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 118"
  body:
    fontFamily: "Inter Variable, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body-lede:
    fontFamily: "Inter Variable, -apple-system, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label-control:
    fontFamily: "Saira Variable, Segoe UI, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 112"
  label-field:
    fontFamily: "Saira Variable, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.18em"
    fontVariation: "'wdth' 115"
  figure:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "22px"
    fontWeight: 500
    letterSpacing: "-0.02em"
  mono-meta:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.04em"
  code:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  corner: "2px"
  ring: "50%"
spacing:
  gutter: "clamp(20px, 4.4vw, 72px)"
  max-width: "1440px"
  section: "clamp(104px, 13vw, 184px)"
  section-head: "clamp(44px, 5.5vw, 76px)"
  panel-inset: "20px"
  panel-roomy: "28px"
  row: "18px"
  action-gap: "12px"
components:
  button-solid:
    backgroundColor: "{colors.action-blue}"
    textColor: "#ffffff"
    typography: "{typography.label-control}"
    rounded: "{rounded.corner}"
    padding: "0 8px 0 20px"
    height: "52px"
  button-solid-hover:
    backgroundColor: "{colors.action-blue-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.readout-white}"
    typography: "{typography.label-control}"
    rounded: "{rounded.corner}"
    padding: "0 8px 0 20px"
    height: "52px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.readout-white}"
    typography: "{typography.label-control}"
    rounded: "{rounded.corner}"
    padding: "0 14px"
    height: "36px"
  command-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "#ffffff"
    typography: "{typography.code}"
    rounded: "{rounded.corner}"
    height: "52px"
  command:
    backgroundColor: "{colors.detector-steel}"
    textColor: "{colors.readout-white}"
    typography: "{typography.code}"
    rounded: "{rounded.corner}"
    height: "52px"
  instrument-strip:
    backgroundColor: "{colors.vacuum-raised}"
    textColor: "{colors.dim-steel}"
    typography: "{typography.mono-meta}"
    padding: "11px 18px"
  panel:
    backgroundColor: "{colors.vacuum-raised}"
    textColor: "{colors.muted-steel}"
    padding: "{spacing.panel-inset}"
  track-label:
    backgroundColor: "transparent"
    textColor: "{colors.readout-white}"
    rounded: "{rounded.corner}"
    padding: "9px 12px 10px 10px"
  track-label-selected:
    backgroundColor: "{colors.detector-steel}"
---

# Design System: Techosoul UI Landing

Scope: this file governs `apps/landing` only. The component library (`packages/techosoul-ui`) and the Showcase app (`apps/showcase`) keep their own light/dark token system and do not follow this world. The landing page borrows exactly one thing from the library: the dark-mode semantic role hexes, which it uses as track and signal colour.

## Overview

**Creative North Star: "The Event Display"**

The page is a detector readout. One synthetic payment sits at the beamline, and its seven tracks curve out through concentric rings (tokens, Ant Design 6, Techosoul, your app) to labels pinned on the right edge. Each label holds a real library component. Everything after the hero keeps the instrument's grammar: hairline-ruled tables, steel panels headed by a mono instrument strip, and figures set like measurements. The ground is a near-black vacuum with a faint fixed dot mesh. Light comes only from the signals.

Density is high but calm. Information sits in ruled rows and framed panels, not in cards. Type works in three registers: wide tracked Saira capitals name things, Martian Mono measures them, and Inter explains them. Corners are close to square (2px) and every boundary is a 1px hairline. The one curved form is the ring, used for the detector, the section-rule node, status dots and the no-entry marks on the scope list.

The page refuses the dark hero with a tilted product screenshot and the three-card feature grid. The event display takes the hero's place, and ruled tables and panels take the place of feature cards.

**Key Characteristics:**
- Vacuum ground (#070b12) with a fixed 22px dot mesh that fades toward the bottom.
- Colour appears only as signal: the library's dark semantic roles, one role per track.
- Selection isolates: everything that is not focused dims, and the focused element brightens and thickens.
- Saira capitals at 112-125% width for names, Martian Mono for figures and code, Inter for prose.
- 2px corners and 1px hairlines everywhere; rings are the only curves.
- Panels are headed by an instrument strip (id · reading · source) in place of eyebrows.

## Colors

A cold, nearly monochrome detector palette in vacuum blacks and steel blues. Saturated colour is reserved for semantic signals and one action blue.

### Primary
- **Action Blue** (action-blue): fills the one primary action in each context (the npm-install command in the hero, solid buttons). Hover deepens it to **Action Blue Deep** (action-blue-deep). White text sits on it.
- **Signal Primary** (signal-primary): the library's dark primary role. Colours the CurrencyAmount track, the focus outline, active layer numbers, step numbers, inline code, founder links and the lead id in every instrument strip. Text selection uses it at 28% alpha.

### Secondary (the signal roles)
These are the library's dark semantic hexes, used unchanged. They colour tracks, calorimeter towers, leader lines and label names, and nothing decorative.
- **Signal Positive** (signal-positive): gains, verified, passed. PnL and KYC tracks, the pass counts in strips, validation matrix cells, the run-state dot.
- **Signal Negative** (signal-negative): losses and fees. The fee track and the struck-ring markers on the out-of-scope list.
- **Signal Warning** (signal-warning): the risk track. The warm low-momentum background curls on the canvas take this hue at low alpha.
- **Signal Info** (signal-info): the transaction-processing track.
- The BidAskDisplay track is the neutral role and uses Muted Steel.

### Neutral
- **Vacuum** (vacuum): the page ground, html background and theme-color.
- **Vacuum Raised** (vacuum-raised): instrument strips, the signal note, founder and instrument frames. Translucent panels use it at 60% alpha (`rgba(10,16,26,0.6)`) and the readout card at 86%.
- **Detector Steel** (detector-steel): filled controls such as the command box, code blocks and the selected track label.
- **Ring Blue** (ring-blue) / **Ring Blue Lit** (ring-blue-lit): detector rings on the canvas, the start of the section-rule gradient, the wordmark ring, and the hover border on outline and ghost buttons.
- **Hairline** (hairline) / **Hairline Strong** (hairline-strong): all 1px dividers. Hairline rules rows and tables; Hairline Strong frames panels and controls.
- **Readout White** (readout-white): headings, figures and the primary vertex.
- **Muted Steel** (muted-steel): body copy and lede.
- **Dim Steel** (dim-steel): field labels, strip metadata and captions (about 6.5:1 on Vacuum).

### Named Rules
**The Signal-Only Rule.** Saturated colour on this page means a semantic role, and the hex comes from the library's dark palette. No hue is added for decoration. If a colour cannot be named as positive, negative, primary, warning, info or action, it does not appear.

**The Vacuum Rule.** The ground is always Vacuum with the dot mesh. Depth comes from Vacuum Raised and Detector Steel panels, never from gradients or lighter backgrounds.

## Typography

**Display Font:** Saira Variable, width axis (falls back to Segoe UI)
**Body Font:** Inter Variable (falls back to -apple-system, Segoe UI)
**Label/Mono Font:** Martian Mono Variable (falls back to ui-monospace)

**Character:** Saira at 112-125% width is the detector's stencil: wide uppercase capitals that name rings, controls and components. Martian Mono reads out the numbers. Inter carries the explanation in plain sentence case.

### Hierarchy
- **Display** (Saira 620, clamp 34-54px, line-height 1, 125% width, uppercase, balanced wrap): the hero headline only, two lines. The second line steps down to a dimmer ring blue.
- **Headline** (Saira 600, clamp 30-54px, line-height 1.04, 125% width, uppercase, max 20ch): section headings. Each sits under a section rule.
- **Title** (Saira 600, 19px, 118% width, sentence case): panel and layer titles. The founder name uses 22px.
- **Body** (Inter 400, 16px / 1.6, Muted Steel): prose capped at 44-54ch. The lede is 18px (17px on mobile). Statement paragraphs in the limits and brand sections go up to clamp 19-26px in Readout White.
- **Label, control** (Saira 500-560, 12-13px, 0.14em tracking, 112% width, uppercase): buttons, nav and the copy action.
- **Label, field** (Saira 400, 10.5-11.5px, 0.16-0.18em tracking, 115% width, uppercase, Dim Steel): table column heads, form field labels, definition-list terms, ring names, role lines.
- **Figure** (Martian Mono 500, 22-26px, -0.02em): measured values. Probe figures use 22px and the hero readout 26px (22px on mobile).
- **Mono meta** (Martian Mono, 10.5-12px): strip and frame headers, track numbers, label readings, hex values.
- **Code** (Martian Mono, 12-13.5px): install commands, code blocks (line-height 1.7) and inline code in Signal Primary.

### Named Rules
**The Three Registers Rule.** Saira names, Mono measures, Inter explains. Mono is for figures, code and instrument metadata only. Prose and headings are never set in Mono.

**The Heading Stands Alone Rule.** A heading has a hairline rule with a ring node above it and nothing else. Context about a panel's source goes in its instrument strip, not in a label over the heading.

## Layout

- **Container:** content max 1440px, centred, with a fluid gutter of clamp 20-72px. Masthead 72px tall, bottom hairline.
- **Hero:** a two-column grid (copy column `minmax(0, 44%)`, then the event). The canvas is positioned absolutely from 30% inward to the right edge, so it runs behind the copy column. A horizontal mask fades the canvas out under the copy (transparent to 140px, solid by 330px). Track labels form a 244px column pinned to the right gutter and centred vertically. Hero height is clamp(780px, 100dvh − 72px, 960px). The selected-track readout card (up to 520px) sits at the bottom of the copy column.
- **Sections:** top padding clamp 104-184px, head-to-content clamp 44-76px. Content is mostly asymmetric two-column grids (1.05fr/1fr, 1fr/340px, 300px/1fr, 1.1fr/1fr, 1.25fr/1fr) with gaps around clamp 32-96px. Install steps are a three-column list.
- **Rows:** tables and lists are ruled with 1px hairlines and padded 14-28px vertically, not boxed per item. Install steps are the exception: each is a framed panel.
- **Sticky asides:** the layer cutaway and the signal note stick 48px from the top on wide screens.
- **At 1180px and below:** nav hides, the hero stacks, and the event becomes a square stage (up to 640px) with labels in a two-column grid underneath. The readout moves between the canvas and the labels. Canvas ring names are hidden in this compact mode. All section grids collapse to one column and sticky asides become static.
- **At 760px and below:** the run-state indicator hides, hero actions go full-width, labels drop to one column, the signal table reflows to two columns with mode tags, and install steps stack.

## Elevation & Depth

The page has no box shadows on surfaces. Depth is tonal layering: Vacuum, then translucent Vacuum Raised panels, then Detector Steel controls, each edged with a 1px hairline. The fixed dot mesh is the furthest plane. The only glows are emitted light, which belongs to the instrument: the focused track on the canvas carries a 14px glow in its own colour, and the run-state dot has a 3px soft halo of Signal Positive at 14%.

### Shadow Vocabulary
- **Track glow** (canvas `shadowBlur: 14`, `shadowColor` = track colour): only on the focused primary track.
- **Status halo** (`box-shadow: 0 0 0 3px rgba(112, 223, 178, 0.14)`): the live run-state dot.

### Named Rules
**The Emitted-Light Rule.** Glow is reserved for things that emit signal: a focused track, a live status dot. Panels, buttons and cards never cast shadows.

## Shapes

Corners are nearly square (2px) on buttons, commands, icon wells, track labels and the segmented control. Panels and code blocks have no radius at all. Every edge is a 1px line: Hairline between rows and Hairline Strong around panels and controls. The ring is the one curved form. It appears as the detector, the section-rule node (a 9px Ring Blue Lit circle at the left end of a gradient hairline that runs from Ring Blue to transparent), status and validation dots (an outlined circle with a filled core), and the out-of-scope marker (a Signal Negative ring struck through at 135°). The readout card's code is separated by a dashed hairline.

## Components

### Buttons
Instrument switches: flat and squared, with wide capitals.
- **Shape:** near-square corners (2px), 52px tall in the hero and install sections, 36px for the ghost variant in the masthead.
- **Solid:** Action Blue fill, white label. A square 36px icon well holds an up-right arrow. Hover deepens to Action Blue Deep.
- **Outline:** transparent with a Hairline Strong border. Hover lights the border to Ring Blue Lit and adds a 5% Signal Primary wash.
- **Ghost:** 36px tall, same hover as outline.
- **Motion:** on hover the icon well shifts 2px up and to the right (0.35s, expo-out). Press scales to 0.98. Colour transitions take 0.18-0.2s on `cubic-bezier(0.2, 0, 0, 1)`.

### Copy Command
- A Detector Steel box with a Hairline Strong border and 2px corners, 52px tall. It holds a Mono command with a dim `$` prompt and a copy button divided off by a hairline. The button label is a control label, and on mobile it shows the icon only.
- The **primary** variant fills with Action Blue, shows white text and dims the prompt to 60%. The copy button announces "Command copied" through a live region.

### Instrument Strip
The panel header that replaces eyebrows.
- A row with items spaced between: an **id** (Signal Primary, 600), then a **reading** (bold reading in Signal Positive for passes; Readout White in the scope panel), then a **source** (Dim Steel). Martian Mono 11px with 0.04em tracking on Vacuum Raised, padded 11px by 18px, with a bottom hairline.
- Heads the validation matrix, package probes, out-of-scope list, each install step and the founder panel. The calibration instrument frame and the readout card header use the same grammar.

### Cards / Containers (Panels)
- **Corner Style:** square.
- **Background:** Vacuum Raised at 60% alpha (readout card at 86%, signal note and founder solid Vacuum Raised).
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px Hairline Strong.
- **Internal Padding:** 20px for ruled content, 28px for prose panels.

### Inputs / Fields
- Calibration controls are the library's Ant Design Segmented control at 2px radius in Inter, each with a field label above. The live instrument preview inside renders the library's own tokens and is not restyled by this world.

### Navigation
- Masthead: the wordmark (ring mark plus Saira 125% capitals, with a 10.5px subtitle in Dim Steel), then control-label links in Muted Steel that turn Readout White on hover, then the run-state indicator and a ghost GitHub button. The footer reuses the link style. Nav hides at 1180px.

### Event Display (signature)
- A canvas detector cross-section drawn in Ring Blue: beam pipe, seven segmented tracker barrels, electromagnetic and hadronic calorimeter wedges, and twelve muon chambers. 64 seeded low-momentum curls (cool steel, and warm in Signal Warning) fill the tracker.
- Seven primary tracks are circular arcs, one per component, each in its role colour. The focused track draws at full alpha and 2.8px with a glow and hit dots. The others dim to 0.22 alpha at 1.3px. Calorimeter towers grow at each exit in proportion to the value's magnitude (CurrencyAmount is deepest, the fee shallowest), and unfocused towers drop to about 0.13 alpha. Leader lines (focused at full alpha, others at 0.14) run from each exit to its pinned label.
- On load the event draws in over 1.7s (cubic ease-out, tracks staggered by 35ms). Dragging rotates it around the beam axis, and on release it keeps turning with inertia (velocity × 0.94 per frame). With reduced motion it renders the final frame and has no inertia.
- **Track labels:** a 28px Mono number in the track colour, the component name as a Saira label in the track colour, and a Mono reading. Unselected labels dim, but no further than 0.72 opacity, which keeps the Muted Steel reading at about 5.6:1 on Vacuum. The canvas does the hard isolation (0.22); the text stays readable. The selected label gets a Detector Steel fill with a Hairline Strong border. Hover or focus previews a track without selecting it.
- **Readout card:** an instrument header, the component name, the live library component at figure size, and its JSX in Signal Primary Mono below a dashed hairline. It animates in over 0.45s (6px rise, 3px blur clearing).

### Layer Cutaway
- An SVG section through the four layers, with bands that light from #142037 to #24406b as each layer scrolls into focus. A Signal Primary track and a thinner Signal Positive track draw in by dash offset over 1.6s. The layer list beside it dims inactive rows and turns the active row's number Signal Primary.

## Do's and Don'ts

### Do:
- **Do** take every track, status and signal colour from the library's dark semantic roles (signal-primary, signal-positive, signal-negative, signal-warning, signal-info), one role per meaning.
- **Do** keep the ground Vacuum with the fixed 22px dot mesh, and build depth from translucent Vacuum Raised panels edged in 1px Hairline Strong.
- **Do** head data panels with an instrument strip (id · reading · source) in Martian Mono 11px.
- **Do** put a section rule (a 9px ring node on a gradient hairline) above every section heading.
- **Do** isolate on selection: dim everything unfocused, and brighten and thicken the focus.
- **Do** keep dimmed text at 4.5:1 or better. For Muted Steel or a signal colour on Vacuum, that means no lower than 0.72 opacity. Drawn strokes on the canvas can dim much further.
- **Do** use 2px corners on controls and square corners on panels.
- **Do** set every figure in Martian Mono and keep every value synthetic display data.
- **Do** honour reduced motion: final frame, no inertia, no reveals.

### Don't:
- **Don't** add hues outside the semantic roles, Action Blue and the steel neutrals.
- **Don't** set prose or headings in Mono.
- **Don't** put an eyebrow or kicker line above a heading. Context goes in the instrument strip.
- **Don't** cast box shadows from panels or buttons. Glow belongs only to emitted signal.
- **Don't** box table rows or list items as separate cards. Rule them with hairlines inside one panel. The install steps are the one exception: each step is its own strip-headed panel.
- **Don't** apply this world to the library or the Showcase app.
