#!/usr/bin/env bash
# Resumable Omni batch — survives SSH/Cursor disconnect (screen or nohup).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]] || ! grep -q '^DEEPSEEK_API_KEY=' .env.local 2>/dev/null; then
  echo "❌ DEEPSEEK_API_KEY missing in .env.local"
  exit 1
fi

LOG_FILE="${OMNI_BATCH_LOG:-/tmp/omni-batch-$(date +%Y%m%d-%H%M%S).log}"
PROGRESS_FILE="$ROOT/scripts/data/omni-batch-progress.json"
PID_FILE="$ROOT/scripts/data/omni-batch.pid"

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(tr -d '[:space:]' < "$PID_FILE" || true)"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "⚠️  Batch already running (pid=$OLD_PID). Log: tail -f /tmp/omni-batch*.log"
    exit 0
  fi
fi

if [[ -f "$PROGRESS_FILE" ]]; then
  COMPLETED="$(node -e "const p=require('$PROGRESS_FILE');console.log((p.completed||[]).length)")"
  FAILED="$(node -e "const p=require('$PROGRESS_FILE');console.log((p.failed||[]).length)")"
  echo "📊 Resume: completed=$COMPLETED failed=$FAILED"
else
  echo "📊 First run — no progress file yet."
fi

RUN_CMD="cd '$ROOT' && npm run generate:batch-resumable 2>&1 | tee -a '$LOG_FILE'"

echo "🚀 Starting batch. Log: $LOG_FILE"

if command -v screen >/dev/null 2>&1; then
  screen -dmS omni-batch bash -c "$RUN_CMD"
  echo "✅ screen session: omni-batch"
  echo "   Attach: screen -r omni-batch"
else
  nohup bash -c "$RUN_CMD" >/dev/null 2>&1 &
  echo "✅ nohup pid: $!"
fi

echo "   Monitor: tail -f '$LOG_FILE'"
echo "   Progress: cat '$PROGRESS_FILE'"
