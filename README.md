# ALwith Design - open-source replication of Claude Design

> An open-source replication of Claude Design — deconstructed from Anthropic's website and rebuilt as a portable Claude Code plugin.

## Origin: What Is Claude Design?

Anthropic's [Claude](https://www.anthropic.com/) has a built-in design capability that lets it produce high-fidelity HTML prototypes, slide decks, animated UIs, and design systems — not wireframes or descriptions, but publication-quality visual artifacts. This capability is baked into Claude's first-party experience but isn't exposed as a public API or installable tool.

**This project reverse-engineers that capability and packages it as a Claude Code plugin anyone can install.**

---

## Replication Process

### Step 1 — Observe the Original

The starting point was studying what Claude Design actually does on claude.ai. Several behavioral patterns emerged:

- **HTML is the design medium.** Claude doesn't generate images or describe layouts — it writes HTML, CSS, and JavaScript that renders directly in a browser.
- **It uses a headless browser toolchain.** Screenshots, console error checking, and multi-viewport verification happen before output is delivered.
- **It has a library of starter scaffolds.** Slide decks, device frames, and animation canvases are never built from scratch — they're instantiated from known-good templates.
- **It applies design system knowledge.** Not just Anthropic's own aesthetic but the visual languages of Stripe, Linear, Apple, and others.
- **It verifies before delivering.** Every artifact is checked for JavaScript errors and visual consistency. Console errors block delivery.
- **It proactively suggests design work.** It doesn't wait to be explicitly asked — it recognizes design opportunities and offers them.

### Step 2 — Deconstruct the Design System

The most directly observable artifact was Anthropic's own website. I analyzed the visual language in detail and codified it as [`design-systems/claude.md`](design-systems/claude.md).

**Color system:** every neutral has a yellow-brown undertone — there are no cool blue-grays anywhere. The full warm neutral palette:

| Token | Value | Role |
|---|---|---|
| Parchment | `#f5f4ed` | Page background — evoking aged paper, not a screen |
| Ivory | `#faf9f5` | Card surfaces elevated above parchment |
| Warm Sand | `#e8e6dc` | Button backgrounds, interactive surfaces |
| Terracotta | `#c96442` | Primary CTA, brand accent — earthy, deliberately un-tech |
| Coral | `#d97757` | Text links on dark surfaces, secondary emphasis |
| Anthropic Near Black | `#141413` | Primary text — not pure black, barely olive-tinted |
| Olive Gray | `#5e5d59` | Secondary body text |
| Stone Gray | `#87867f` | Tertiary text, metadata |
| Dark Surface | `#30302e` | Dark-theme containers, warm charcoal |

**Typography:** the Anthropic type family — Serif for editorial headlines, Sans for UI, Mono for code — with tight-but-comfortable line heights (1.10–1.30) that read more like an essay than a product page.

**Shadow system:** `box-shadow: 0px 0px 0px 1px <color>` — ring-based depth that creates containment without visible drop shadows or borders.

**Illustration language:** organic, hand-drawn-feeling terracotta illustrations replacing the typical tech iconography.

**Anti-pattern:** no cool blue-grays, no purple gradients, no rounded-corner cards with accent borders — deliberately counter to most AI product pages.

This became one of 12 design system references in the plugin.

### Step 3 — Map the Capability Surface

Claude Design isn't a single feature. Studying interaction patterns revealed it's at least five distinct behavioral modes:

| Observed Behavior | Replicated Skill |
|---|---|
| "Design a landing page" → polished HTML artifact, 3+ variations | `design-expert` |
| "QA the UI" → categories of visual issues found and fixed atomically, before/after screenshots | `design-review` |
| "What should our design system be?" → interviews product, researches landscape, writes `DESIGN.md` | `design-consultation` |
| "Show me options" → multiple variants rendered, comparison board opened, structured feedback loop | `design-shotgun` |
| "Review the plan from a design perspective" → rates each design dimension 0–10, explains gaps, fixes the plan | `plan-design-review` |
| Skills activate without explicit invocation | `using-design-superpowers` router |

The router skill is the key to the "it just works" experience: injected at session start via a `SessionStart` hook, it loads into Claude's context and registers when each skill should fire. The user never needs to type a slash command.

### Step 4 — Rebuild the Toolchain

The toolchain is what separates publication-quality design from generic code generation. Without the ability to actually render and screenshot HTML, the model is flying blind. Every tool is a focused shell script in `bin/`:

**Preview & Verification**

```bash
# Open HTML in browser AND launch headless preview simultaneously
bin/show-html Landing\ Page.html
bin/show-html Landing\ Page.html --no-browser   # headless only

# Verify: open + check console errors. Always the final step.
bin/done Landing\ Page.html
# → STATUS: clean
# → STATUS: errors (with full details)

# Screenshot at any viewport or element
bin/screenshot --viewport 1920x1080 output.png
bin/screenshot --selector ".hero" hero-section.png
bin/screenshot --goto "http://localhost:3210/deck.html" deck.png

# Read browser console output
bin/get-webview-logs
bin/get-webview-logs --errors    # errors only
bin/get-webview-logs --clear

# Execute JavaScript in the headless browser
bin/eval-js "document.querySelectorAll('.slide').length"
bin/eval-js --file /tmp/interaction-test.js
```

**Multi-Step Capture** (for slide decks, animations, state sequences)

```bash
bin/save-screenshot --path deck.html --output slides.png \
  --steps '[{"code":"goToSlide(0)","delay":600},{"code":"goToSlide(1)","delay":600}]'
# Outputs: 01-slides.png, 02-slides.png, ...

bin/multi-screenshot --path deck.html --output-dir /tmp/captures \
  --steps '[{"code":"goToSlide(0)"},{"code":"goToSlide(1)"}]'
```

**Export**

```bash
# HTML slides → PowerPoint (pixel-perfect screenshot mode)
bin/gen-pptx --input deck.html --output presentation.pptx \
  --slides '[{"showJs":"goToSlide(0)","delay":600},{"showJs":"goToSlide(1)"}]'

# Bundle all assets into a single self-contained file
bin/super-inline-html --input page.html --output page-standalone.html

# Print/PDF via browser
bin/open-for-print page.html
```

**Dev Server**

```bash
bin/design-tool server-start .   # port 3210
bin/design-tool server-stop
```

**The critical insight:** `done` is always the last step. No artifact ships without checking console errors. This single discipline is what prevents a category of "looks fine in source, broken at runtime" failures.

### Step 5 — Extract the Starter Components

Claude Design has implicit knowledge of common design scaffolds. Making these explicit as ready-made React/JSX components gives the model a reliable foundation and eliminates wheel-reinvention:

**`deck_stage.js`** — Web Component `<deck-stage>`, no framework dependency.
- Auto-scales a fixed 1920×1080 canvas to fit any viewport with letterboxing
- Keyboard navigation (← →, Space, Home/End), click/tap zones (left third = prev, right two-thirds = next)
- `localStorage` persistence of current slide across page refreshes
- Print-to-PDF support (one CSS page per slide)
- Posts `{slideIndexChanged: N}` to parent window for speaker notes sync
- `noscale` attribute disables scaling for PPTX export mode

**`animations.jsx`** — Timeline animation engine for React/Babel.
- `<Stage duration={5000}>` container with scrubber, play/pause controls, auto-scale
- `<Sprite start={0} end={2000}>` renders children at a progress value from 0–1
- `interpolate(progress, 0, 1, startVal, endVal)` for any numeric property
- Entry/exit primitives, easing functions (ease-in, ease-out, spring)

**`design_canvas.jsx`** — `<DesignCanvas columns={3}>` + `<DesignOption label="Option A">`. Grid layout for presenting design variants side-by-side for comparison.

**Device frames** — Each is a self-contained React component:
- `<IOSFrame model="iphone15pro">` — Dynamic Island, status bar with time/signal, home indicator. Also: `iphone15`, `iphoneSE`
- `<AndroidFrame model="pixel8">` — Punch-hole camera, navigation pill
- `<MacOSWindow title="My App" variant="dark">` — Traffic-light controls (close/minimize/expand)
- `<BrowserWindow url="https://..." tabs={["Home", "About"]}>` — Address bar, tabs, back/forward

All components use pinned CDN versions (React 18.3.1, Babel 7.29.0) — no build step, no package.json, no node_modules.

### Step 6 — Code the Design Review Discipline

The 80-item visual audit covers 10 categories:

1. **Layout & Spacing** — padding consistency, grid alignment, breathing room
2. **Typography** — hierarchy, size scale, line height, weight contrast
3. **Color** — contrast ratios, palette adherence, semantic use of color
4. **Hierarchy** — visual weight, focal points, reading order
5. **Consistency** — component patterns, interaction patterns, terminology
6. **AI Slop Detection** — purple gradient abuse, 3-column icon grids, emoji as decoration, centered-everything syndrome, left-border accent cards, overused fonts (Inter, Roboto, Arial)
7. **Interaction** — hover states, transitions, animation performance
8. **Responsive** — behavior at desktop, tablet, mobile viewports
9. **Accessibility** — minimum contrast, touch targets (44px), semantic HTML
10. **Content Quality** — no lorem ipsum, no broken images, no placeholder copy

Each issue found is fixed atomically with a before/after screenshot pair. This is closer to a code review with evidence than a design comment.

### Step 7 — Package as a Plugin

The whole system is wired together as a Claude Code plugin:

```
.claude-plugin/plugin.json          ← plugin identity
hooks/hooks.json                    ← declares SessionStart hook
hooks/session-start                 ← reads using-design-superpowers/SKILL.md,
                                       escapes it as JSON, injects as additional_context
```

The session start hook fires on every `startup`, `resume`, `clear`, and `compact` event. Claude wakes up already knowing all five design skills and exactly when to trigger each one — no slash command required. This is the mechanism that makes the plugin feel like a built-in capability rather than an installed tool.

---

## Design System References

12 brand references pre-loaded as skill context. Each covers aesthetic direction, color palette, typography, spacing, motion, component patterns, and anti-patterns:

| File | Brand | Character |
|---|---|---|
| `claude.md` | Claude / Anthropic | Warm terracotta, parchment, literary editorial |
| `stripe.md` | Stripe | Blurple gradients, elegant, fintech |
| `linear-app.md` | Linear | Minimalist, purple accent, developer-dense |
| `vercel.md` | Vercel | Black & white precision, Geist font |
| `notion.md` | Notion | Warm minimalism, serif headings, soft surfaces |
| `apple.md` | Apple | Premium white space, SF Pro, cinematic imagery |
| `figma.md` | Figma | Colorful, playful, professional |
| `supabase.md` | Supabase | Dark emerald, code-first |
| `spotify.md` | Spotify | Dark + vibrant green, bold type, album art |
| `airbnb.md` | Airbnb | Warm coral, photography-driven, rounded |
| `tesla.md` | Tesla | Extreme reduction, cinematic, full-bleed |
| `cursor.md` | Cursor | Sleek dark, gradient accents, IDE aesthetic |

Copy any file to your project root as `DESIGN.md` to activate it as the design constraint for all subsequent work.

---

## Architecture

```
alwith-design/
├── .claude-plugin/
│   └── plugin.json                # Plugin identity and metadata
├── skills/                        # The brain — 6 SKILL.md definitions
│   ├── design-expert/             # Core artifact creation: HTML → verify → deliver
│   ├── design-review/             # Visual QA: 80-item audit, atomic fixes, before/after screenshots
│   ├── design-consultation/       # Design system builder: interviews → research → DESIGN.md
│   ├── design-shotgun/            # Multi-variant: generate → compare board → feedback → iterate
│   ├── plan-design-review/        # Plan-mode critique: rate 0–10 per dimension, fix gaps
│   └── using-design-superpowers/  # Skill router — injected at every session start
├── commands/                      # 4 slash commands (thin wrappers that invoke skills)
│   ├── design.md
│   ├── design-review.md
│   ├── design-system.md
│   └── design-explore.md
├── agents/
│   └── design-verifier.md         # Independent QA subagent (spawned for non-trivial work)
├── bin/                           # 16 shell tools — the hands
│   ├── show-html                  # Open + headless preview
│   ├── done                       # Verify: console check (always last)
│   ├── screenshot                 # Capture at any viewport/selector
│   ├── eval-js                    # Execute JS in headless browser
│   ├── get-webview-logs           # Read browser console
│   ├── save-screenshot            # Multi-step capture
│   ├── multi-screenshot           # Batch capture
│   ├── image-metadata             # Dimensions, format, transparency
│   ├── gen-pptx                   # HTML → PowerPoint (screenshot mode)
│   ├── super-inline-html          # Bundle into single self-contained file
│   ├── open-for-print             # Print/PDF via browser
│   ├── design-tool                # Local dev server (port 3210)
│   ├── fork-verifier              # Generate QA agent prompt
│   ├── register-assets            # Track design assets
│   ├── run-script                 # Execute bun scripts with file I/O helpers
│   └── copy-starter-component     # Drop scaffolds into project
├── starters/                      # 7 ready-made React/JS scaffolds
│   ├── deck_stage.js              # Slide deck web component (1920×1080, no framework)
│   ├── animations.jsx             # Timeline engine: Stage + Sprite + easing
│   ├── design_canvas.jsx          # Multi-option comparison grid
│   ├── ios_frame.jsx              # iPhone 15 Pro/15/SE with Dynamic Island
│   ├── android_frame.jsx          # Pixel 8 with punch-hole camera
│   ├── macos_window.jsx           # macOS window with traffic lights
│   └── browser_window.jsx         # Browser chrome with address bar + tabs
├── design-systems/                # 12 brand references
│   ├── INDEX.md
│   ├── claude.md                  # Anthropic's design language — the original
│   └── ...11 more
├── hooks/
│   ├── hooks.json                 # Declares SessionStart trigger
│   └── session-start              # Injects using-design-superpowers into context
└── lib/
    ├── server.sh                  # Dev server utilities
    ├── browse-helper.sh           # Headless browser path resolution
    └── manifest.sh                # Asset manifest helpers
```

---

## Installation

```bash
git clone https://github.com/ALwith-ai/ALwith-Design.git ~/.claude/plugins/alwith-design
```

**Prerequisite:** The `browse` tool for headless browser features. Run `/browse` once in Claude Code to set it up (one-time build).

---

## Commands

| Command | What it does |
|---|---|
| `/design` | Create prototypes, animations, slide decks, UI mockups |
| `/design-review` | Visual QA — find and fix spacing, hierarchy, consistency issues |
| `/design-system` | Design system consultation — generate your `DESIGN.md` |
| `/design-explore` | Multi-variant exploration with side-by-side comparison board |

Commands are thin wrappers — they invoke the corresponding skill. Skills also trigger automatically from conversation context.

---

## Usage Examples

```
"Design a landing page for my AI product"
"Create an animated product demo with a 5-second timeline"
"Make a pitch deck with 10 slides, 1920×1080"
"Show me 3 different dashboard layouts"
"QA the spacing and visual consistency of my app"
"Create a design system for my SaaS — make it feel like Stripe but warmer"
"Make an iPhone 15 Pro mockup of my app's onboarding flow"
"Review my implementation plan from a design perspective"
"Export the deck to PowerPoint"
```

---

## Design Principles

Derived from observing how Claude Design behaves on claude.ai:

- **HTML is the design tool** — high-fidelity artifacts, not wireframes or descriptions
- **No AI slop** — actively detect and eliminate: purple gradients, 3-column icon grids, emoji as decoration, centered-everything syndrome, rounded cards with left-border accents, Inter/Roboto/Arial as default fonts
- **Verify before delivering** — `done` always runs last; console errors are blockers, not warnings
- **Design exploration by default** — 3+ variations minimum; mix by-the-book with novel interactions
- **Proactive, not reactive** — suggest design skills when there's an opportunity; don't wait to be asked
- **No filler content** — every element earns its place; ask before adding sections the user didn't request

---

## Tech Stack

- **Shell scripts** (bash) — all 16 toolchain utilities, zero runtime dependencies
- **React 18.3.1 + Babel 7.29.0** — pinned CDN versions for inline JSX prototypes, no build step
- **pptxgenjs** — PowerPoint export, auto-installed on first use
- **Python 3 `http.server`** — local dev server on port 3210
- **Headless browser** (via browse tool) — screenshots, JS execution, console capture, verification

---

## License

MIT License — Copyright (c) 2026 ALwith AI

See [LICENSE](LICENSE) for details.