#!/usr/bin/env bash
# DeepSeek V4 Pro → Cursor proxy (reasoning_content fix)
# Usage: npm run start:deepseek-proxy

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ .env.local yok. cp .env.example .env.local && DEEPSEEK_API_KEY=..."
  exit 1
fi

DEEPSEEK_API_KEY="$(grep '^DEEPSEEK_API_KEY=' "$ENV_FILE" | cut -d= -f2- | sed 's/^"//;s/"$//' | tr -d '\r')"
export DEEPSEEK_API_KEY

if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
  echo "❌ DEEPSEEK_API_KEY tanımlı değil (.env.local)"
  exit 1
fi

if lsof -ti:9000 >/dev/null 2>&1; then
  echo "⚠️  Port 9000 dolu — mevcut proxy çalışıyor olabilir."
  echo "   Durdurmak için: lsof -ti:9000 | xargs kill"
  exit 1
fi

echo "▶ deepseek-cursor-proxy başlatılıyor (port 9000, ngrok otomatik)..."
echo "   Durdurmak için: npm run stop:deepseek-proxy"
echo ""

export DEEPSEEK_API_KEY
exec python3 -m deepseek_cursor_proxy
