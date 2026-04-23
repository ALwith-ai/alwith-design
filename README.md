# ALwith Design

> alwith's open-source alternative to Claude Design — bringing its generative design capability into a portable, embeddable form that any AI agent or workflow can invoke on demand.

ALwith Design turns natural-language prompts into polished HTML design artifacts: slide decks, landing pages, animated prototypes, UI mockups, and complete design systems. It activates the right design skill automatically, uses a professional toolchain (headless browser, screenshot verification, starter components), and delivers publication-quality visual output — exportable to PPTX, PDF, or self-contained HTML.

## Features

- **High-fidelity HTML prototypes** — landing pages, dashboards, mobile UIs, not wireframes
- **Slide deck creation** — 1920x1080 canvas with keyboard nav, speaker notes, PDF/PPTX export
- **Animation engine** — timeline-based animations with easing, play/pause, scrubber
- **Design review & QA** — automated visual audit with 80-item checklist, before/after screenshots, atomic fix commits
- **Design system consultation** — research the landscape, propose typography/color/spacing/motion, generate `DESIGN.md`
- **Multi-variant exploration** — generate 3+ design directions, compare side-by-side, iterate with feedback
- **AI slop detection** — identify and eliminate generic AI-generated design patterns (purple gradients, 3-column icon grids, centered everything...)
- **12 pre-loaded design system references** — Airbnb, Apple, Claude, Cursor, Figma, Linear, Notion, Spotify, Stripe, Supabase, Tesla, Vercel
- **Device frames** — iOS, Android, macOS, and browser window bezels for realistic mockups

## Installation

Clone this repo into your Claude Code plugins directory:

```bash
git clone https://github.com/ALwith-ai/ALwith-Design.git ~/.claude/plugins/alwith-design
```

### Prerequisites

This plugin requires the **browse** tool for headless browser features (screenshots, verification). Run `/browse` once in Claude Code to set it up.

## Commands

| Command | Description |
|---------|-------------|
| `/design` | Create prototypes, animations, slide decks, UI mockups |
| `/design-review` | Visual QA — find and fix spacing, hierarchy, consistency issues |
| `/design-system` | Design system consultation — create your `DESIGN.md` |
| `/design-explore` | Multi-variant design exploration with comparison board |

Skills are also triggered automatically based on conversation context — just describe what you want to design.

## How It Works

### Architecture

```
alwith-design/
├── .claude-plugin/       # Plugin metadata (plugin.json)
├── skills/               # 6 skill definitions (the brain)
│   ├── design-expert/    # Core design artifact creation
│   ├── design-review/    # Visual QA audit + fix loop
│   ├── design-consultation/  # Design system builder
│   ├── design-shotgun/   # Multi-variant exploration
│   ├── plan-design-review/   # Plan-mode design critique
│   └── using-design-superpowers/  # Skill router (session start)
├── commands/             # 4 slash commands (entry points)
├── agents/               # Design verifier agent
├── bin/                  # 16 shell tools (the hands)
├── starters/             # 7 ready-made React/JS components
├── design-systems/       # 12 brand reference files
├── hooks/                # Session start hook
└── lib/                  # Shared utilities (server, browse helper)
```

### Skills

| Skill | Trigger | What It Does |
|-------|---------|--------------|
| **Design Expert** | "design this", "make a prototype", "create a deck" | Produces HTML design artifacts with full toolchain |
| **Design Review** | "audit the design", "visual QA", "looks off" | 10-category, 80-item visual audit with automated fixes |
| **Design Consultation** | "design system", "brand guidelines" | Researches landscape, proposes complete design system, writes `DESIGN.md` |
| **Design Shotgun** | "explore designs", "show me options" | Generates multiple variants, opens comparison board, collects feedback |
| **Plan Design Review** | "review the design plan" | Rates plan design dimensions 0-10, fixes gaps before implementation |
| **Using Design Superpowers** | Session start | Registers all skills and routes user intent to the right skill |

### Toolchain (`bin/`)

**Preview & Verification**
- `show-html` — Open HTML in browser + headless preview
- `done` — Show HTML + check console errors (always run before delivering)
- `screenshot` — Capture page at any viewport size or CSS selector
- `eval-js` — Execute JavaScript in the browser
- `get-webview-logs` — Read console output

**Starter Components**
- `copy-starter-component` — Drop ready-made scaffolds into your project

**Screenshots & Capture**
- `save-screenshot` — Multi-step capture (e.g., slide-by-slide)
- `multi-screenshot` — Batch capture
- `image-metadata` — Image dimensions, format, transparency info

**Export**
- `gen-pptx` — HTML slides to PowerPoint (pixel-perfect screenshot mode)
- `super-inline-html` — Bundle HTML + CSS + JS + images into a single file
- `open-for-print` — Print/PDF via browser

**Dev Tools**
- `design-tool` — Start/stop local dev server (port 3210)
- `fork-verifier` — Generate verification prompt for design QA agent
- `register-assets` — Track design assets
- `run-script` — Execute bun scripts with helper API

### Starter Components

Ready-made React/JSX and JS scaffolds for common design patterns:

| Component | Description |
|-----------|-------------|
| `deck_stage.js` | Slide deck web component — 1920x1080 canvas, keyboard/click nav, print-to-PDF |
| `animations.jsx` | Timeline animation engine — Stage, Sprite, easing functions, play/pause |
| `design_canvas.jsx` | Grid layout for presenting design variations |
| `ios_frame.jsx` | iPhone bezel (15 Pro, 15, SE) with Dynamic Island, status bar |
| `android_frame.jsx` | Android bezel (Pixel 8) with punch-hole camera |
| `macos_window.jsx` | macOS window with traffic lights |
| `browser_window.jsx` | Browser chrome with address bar and tabs |

### Design System References

12 pre-loaded brand design system references covering aesthetic direction, color palette, typography, spacing, motion, and component patterns for: **Airbnb**, **Apple**, **Claude**, **Cursor**, **Figma**, **Linear**, **Notion**, **Spotify**, **Stripe**, **Supabase**, **Tesla**, **Vercel**.

Use them as inspiration or copy one to your project root as `DESIGN.md` to match a specific brand aesthetic.

### Design Verifier Agent

An independent verification agent that screenshots HTML at multiple viewports, checks console errors, validates visual consistency, responsive behavior, and accessibility basics. Automatically spawned for non-trivial design artifacts.

## Usage Examples

```
"Design a landing page for my AI product"
"Create an animated product demo"
"Make a pitch deck with 10 slides"
"Show me 3 different dashboard layouts"
"QA the spacing and visual consistency of my app"
"Create a design system for my project"
"Make an iPhone mockup of my app's onboarding flow"
"Review my implementation plan from a design perspective"
```

## Design Principles

ALwith Design follows opinionated design principles:

- **HTML is the design tool** — produces high-fidelity artifacts, not wireframes or descriptions
- **No AI slop** — actively detects and eliminates generic AI patterns (purple gradients, 3-column icon grids, emoji as decoration, centered everything)
- **Verify before delivering** — every artifact is checked for console errors and visual quality
- **Design exploration by default** — generates 3+ variations to find the best direction
- **Proactive, not reactive** — suggests design skills when it sees an opportunity

## Tech Stack

- **Shell scripts** (bash) for all toolchain utilities
- **React 18 + Babel** for inline JSX prototypes (loaded from CDN)
- **pptxgenjs** for PowerPoint export
- **Python 3** `http.server` for local dev server
- **Headless browser** (via browse tool) for screenshots and verification

## License

MIT License — Copyright (c) 2026 Dong Zhang

See [LICENSE](LICENSE) for details.
