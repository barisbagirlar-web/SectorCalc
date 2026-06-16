#!/usr/bin/env bash
# Kalan failed araçları 10 API key ile paralel tamamlar.
set -euo pipefail
cd "$(dirname "$0")/../.."
npx tsx scripts/deepseek/launch-resume-failed-parallel.ts
