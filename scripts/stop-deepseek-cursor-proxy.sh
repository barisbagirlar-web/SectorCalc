#!/usr/bin/env bash
set -euo pipefail
PIDS=$(lsof -ti:9000 2>/dev/null || true)
if [[ -z "$PIDS" ]]; then
  echo "Proxy zaten kapalı (port 9000 boş)."
  exit 0
fi
echo "$PIDS" | xargs kill -9 2>/dev/null || true
echo "✅ Proxy durduruldu."
