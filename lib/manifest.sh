#!/bin/bash
# manifest.sh — manage asset review manifest (JSON)
# Source this file: source "$(dirname "$0")/../lib/manifest.sh"

MANIFEST_FILE=".design-assets.json"

manifest_init() {
  if [ ! -f "$MANIFEST_FILE" ]; then
    echo '{"assets":[]}' > "$MANIFEST_FILE"
  fi
}

manifest_register() {
  local path="$1"
  local asset="$2"
  local group="${3:-}"
  local subtitle="${4:-}"
  local status="${5:-needs-review}"

  manifest_init

  # Build JSON entry
  local entry
  entry=$(cat <<EOF
{"path":"$path","asset":"$asset","group":"$group","subtitle":"$subtitle","status":"$status"}
EOF
  )

  # Remove existing entry with same path+asset, then add new
  local tmp
  tmp=$(mktemp)
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "
import json, sys
m = json.load(open('$MANIFEST_FILE'))
m['assets'] = [a for a in m['assets'] if not (a['path'] == '$path' and a['asset'] == '$asset')]
m['assets'].append(json.loads('$entry'))
json.dump(m, open('$tmp', 'w'), indent=2)
"
    mv "$tmp" "$MANIFEST_FILE"
  fi
  echo "Registered: $asset ($path)"
}

manifest_unregister() {
  local path="${1:-}"
  local asset="${2:-}"

  manifest_init

  local tmp
  tmp=$(mktemp)
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "
import json
m = json.load(open('$MANIFEST_FILE'))
m['assets'] = [a for a in m['assets']
  if not (('$path' == '' or a['path'] == '$path') and ('$asset' == '' or a['asset'] == '$asset'))]
json.dump(m, open('$tmp', 'w'), indent=2)
"
    mv "$tmp" "$MANIFEST_FILE"
  fi
  echo "Unregistered: ${asset:-any} (${path:-any})"
}

manifest_list() {
  manifest_init
  cat "$MANIFEST_FILE"
}
