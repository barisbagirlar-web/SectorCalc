#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
npx tsx scripts/deepseek/launch-retry-scan-failed.ts
