#!/usr/bin/env bash
# 10 key paralel batch — TypeScript launcher'a yönlendirir.
set -euo pipefail
cd "$(dirname "$0")/../.."
npx tsx scripts/deepseek/launch-parallel-batches.ts
