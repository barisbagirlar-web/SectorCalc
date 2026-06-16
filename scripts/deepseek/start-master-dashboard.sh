#!/usr/bin/env bash
# 6 shard master dashboard — 3 saniyede bir yenilenir.
set -euo pipefail
cd "$(dirname "$0")/../.."
INTERVAL="${DASHBOARD_INTERVAL:-10}"
if screen -ls 2>/dev/null | grep -q '\.master-dash'; then
  echo "Master dashboard zaten çalışıyor: screen -r master-dash"
  exit 0
fi
screen -dmS master-dash bash -c "npx tsx scripts/deepseek/watch-master-batch.ts --interval=${INTERVAL}"
echo "Master dashboard başlatıldı (her ${INTERVAL} sn)."
echo "Bağlan: screen -r master-dash"
