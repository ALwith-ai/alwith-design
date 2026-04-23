#!/bin/bash
# browse-helper.sh — locate and verify gstack browse binary
# Source this file: source "$(dirname "$0")/../lib/browse-helper.sh"

_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && [ -x "$HOME/.claude/skills/gstack/browse/dist/browse" ] && B="$HOME/.claude/skills/gstack/browse/dist/browse"

if [ -z "$B" ] || [ ! -x "$B" ]; then
  echo "ERROR: gstack browse binary not found. Run /browse setup first." >&2
  exit 1
fi

export B
