#!/usr/bin/env bash
# Canlı batch dashboard — 3 saniyede bir yenilenir.
# Kullanım:
#   bash scripts/deepseek/start-v4-dashboard.sh
#   screen -r dashboard
set -euo pipefail
cd "$(dirname "$0")/../.."
INTERVAL="${DASHBOARD_INTERVAL:-3}"
if screen -ls 2>/dev/null | grep -q '\.dashboard'; then
  echo "Dashboard zaten çalışıyor. Bağlan: screen -r dashboard"
  exit 0
fi
screen -dmS dashboard bash -c "npx tsx scripts/deepseek/watch-v4-pro-batch.ts --interval=${INTERVAL}"
echo "Dashboard başlatıldı (her ${INTERVAL} sn güncellenir)."
echo "Bağlan: screen -r dashboard"
echo "Ayrıl:  Ctrl+A, D"
