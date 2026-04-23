#!/bin/bash
# server.sh — manage a local dev server for HTML preview
# Source this file: source "$(dirname "$0")/../lib/server.sh"

DESIGN_SERVER_PORT=${DESIGN_SERVER_PORT:-3210}
DESIGN_SERVER_PID_FILE="/tmp/design-server-${DESIGN_SERVER_PORT}.pid"
DESIGN_SERVER_LOG="/tmp/design-server-${DESIGN_SERVER_PORT}.log"

server_start() {
  local root_dir="${1:-.}"

  # Check if already running
  if [ -f "$DESIGN_SERVER_PID_FILE" ]; then
    local pid
    pid=$(cat "$DESIGN_SERVER_PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      echo "Server already running on port $DESIGN_SERVER_PORT (PID $pid)"
      return 0
    fi
    rm -f "$DESIGN_SERVER_PID_FILE"
  fi

  # Try python3 first (always available on macOS)
  if command -v python3 >/dev/null 2>&1; then
    cd "$root_dir" && python3 -m http.server "$DESIGN_SERVER_PORT" \
      > "$DESIGN_SERVER_LOG" 2>&1 &
    echo $! > "$DESIGN_SERVER_PID_FILE"
    sleep 1
    echo "Server started on http://localhost:$DESIGN_SERVER_PORT (PID $!)"
    return 0
  fi

  echo "ERROR: python3 not found. Cannot start dev server." >&2
  return 1
}

server_stop() {
  if [ -f "$DESIGN_SERVER_PID_FILE" ]; then
    local pid
    pid=$(cat "$DESIGN_SERVER_PID_FILE")
    kill "$pid" 2>/dev/null
    rm -f "$DESIGN_SERVER_PID_FILE"
    echo "Server stopped (PID $pid)"
  else
    echo "No server running"
  fi
}

server_url() {
  local file_path="$1"
  echo "http://localhost:$DESIGN_SERVER_PORT/$file_path"
}

server_is_running() {
  if [ -f "$DESIGN_SERVER_PID_FILE" ]; then
    local pid
    pid=$(cat "$DESIGN_SERVER_PID_FILE")
    kill -0 "$pid" 2>/dev/null
    return $?
  fi
  return 1
}
