#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"

if ! command -v codebase-memory-mcp >/dev/null 2>&1; then
  INSTALLER="$(mktemp)"
  trap 'rm -f "$INSTALLER"' EXIT
  curl --fail --silent --show-error --location --proto '=https' --tlsv1.2 \
    https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh \
    --output "$INSTALLER"
  bash "$INSTALLER"
fi

codebase-memory-mcp config set auto_index true
codebase-memory-mcp config set auto_watch true
codebase-memory-mcp config set auto_index_limit 50000
codebase-memory-mcp cli --progress index_repository --repo-path "$REPO_ROOT"
codebase-memory-mcp cli list_projects

printf '%s\n' \
  'Codebase Memory is installed and this repository is indexed.' \
  'Restart Cursor so the MCP server and managed agent configuration are loaded.'
