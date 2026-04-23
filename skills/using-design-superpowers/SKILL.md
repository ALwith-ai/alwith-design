---
name: using-design-superpowers
description: "You MUST use this on session start — registers all design skills and tells you when to invoke each one automatically"
---

# Using Design Superpowers

You have **design superpowers** — a complete design toolkit for Claude Code. These skills
activate automatically based on user intent. You don't need to be told to use them.

## Available Skills

### alwith-design:design-expert (Command: /design)

**When to invoke:** User asks to create any visual design artifact — prototypes, animations,
slide decks, UI mockups, landing pages, or design explorations.

**Trigger phrases:** "design this", "make a prototype", "create a deck", "make slides",
"UI mockup", "animate this", "build a landing page", "design exploration"

**Proactively suggest when:** User describes something visual but hasn't asked for a design.

### alwith-design:design-review (Command: /design-review)

**When to invoke:** User wants visual QA on an existing UI — finding spacing issues,
hierarchy problems, inconsistencies, and AI slop patterns, then fixing them.

**Trigger phrases:** "audit the design", "visual QA", "check if it looks good",
"design polish", "fix the spacing", "looks off"

**Proactively suggest when:** Implementation is complete and the UI hasn't been visually reviewed.

### alwith-design:design-consultation (Command: /design-system)

**When to invoke:** User needs a design system — typography, colors, spacing, motion rules.
Creates DESIGN.md as the project's design source of truth.

**Trigger phrases:** "design system", "brand guidelines", "create DESIGN.md",
"what fonts should we use", "color palette"

### alwith-design:design-shotgun (Command: /design-explore)

**When to invoke:** User wants to explore multiple design directions before committing.
Generates variants, opens a comparison board, collects feedback.

**Trigger phrases:** "explore designs", "show me options", "design variants",
"visual brainstorm", "I don't like how this looks"

**Proactively suggest when:** User describes a UI feature but hasn't seen options yet.

### alwith-design:plan-design-review

**When to invoke:** In plan mode, to review the design dimensions of an implementation plan.
Rates each dimension 0-10, explains what would make it a 10, then fixes the plan.

**Trigger phrases:** "review the design plan", "is this plan good from a design perspective"

## How Skills Work

1. When you detect user intent matching a skill above, invoke it using the **Skill tool**
2. The skill will load its full instructions — follow them exactly
3. Skills have access to a complete design toolchain in `${CLAUDE_PLUGIN_ROOT}/bin/`
4. Set `DESIGN_BIN="${CLAUDE_PLUGIN_ROOT}/bin"` before running any design tools

## Design Verification

After completing any non-trivial design work, use the **design-verifier** agent
(via the Agent tool) to independently verify the output. The verifier checks:
console errors, visual consistency, responsive behavior, and content quality.

## Key Principles

- **HTML is your design tool** — you produce high-fidelity artifacts, not wireframes
- **No AI slop** — avoid generic gradients, emoji, rounded-corner cards with accents
- **Proactive, not reactive** — suggest design skills when you see an opportunity
- **Verify before delivering** — always run `done` to check for errors
