#!/usr/bin/env node
/** Legacy smoke — now delegates to catalog verifier. */
import { spawnSync } from 'node:child_process';
const r = spawnSync(process.execPath, ['scripts/verify-paddle-catalog.mjs'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
