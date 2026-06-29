#!/bin/sh
# SectorCalc — Static Dev Server
# Kullanım: sh dev.sh
# Browser: http://localhost:3000
# 
# Kod değişikliğinden sonra:
#   sh dev.sh           # clean rebuild + restart
#   npm run pm2:restart  # PM2 hot restart (varolan build ile)

echo "=== SectorCalc Dev Server ==="
echo ""

cd "$(dirname "$0")"

# Port temizle
for pid in $(lsof -ti tcp:3000 2>/dev/null || true); do
  kill -9 "$pid" 2>/dev/null || true
done

# Cache temizle
rm -rf .next

sleep 1

# Build + serve
exec node scripts/dev-static.mjs
