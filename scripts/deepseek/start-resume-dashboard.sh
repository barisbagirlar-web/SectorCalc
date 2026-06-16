#!/usr/bin/env bash
# Resume failed batch dashboard — 3 saniyede bir yenilenir.
set -euo pipefail
cd "$(dirname "$0")/../.."
INTERVAL="${DASHBOARD_INTERVAL:-3}"
if screen -ls 2>/dev/null | grep -q '\.resume-dash'; then
  echo "Dashboard zaten çalışıyor. Bağlan: screen -r resume-dash"
  exit 0
fi
screen -dmS resume-dash bash -c "npx tsx scripts/deepseek/watch-resume-failed-batch.ts --interval=${INTERVAL}"
echo "Resume dashboard başlatıldı (her ${INTERVAL} sn güncellenir)."
echo "Bağlan: screen -r resume-dash"
echo "Ayrıl:  Ctrl+A, D"
