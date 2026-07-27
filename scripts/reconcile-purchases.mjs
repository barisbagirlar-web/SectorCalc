#!/usr/bin/env node
/**
 * Replay-safe purchase reconciliation entrypoint.
 * Requires Admin SDK credentials + PADDLE_API_KEY with read access.
 * Always reports scheduler status honestly.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] == null) process.env[m[1]] = m[2];
  }
}
loadEnv(resolve(process.cwd(), '.env.local'));

console.log('RECONCILIATION_SCHEDULER_MISSING=YES');
console.log('STATUS=STUB');
console.log('ACTION=Wire Cloud Scheduler → HTTP reconcile once Functions are deployed.');
console.log('ALGORITHM=Same grantCreditsForCompletedTransaction as webhook (SSOT).');
console.log('STUCK_STATUSES=PENDING,CHECKOUT_CREATED,PAYMENT_COMPLETED');

if (!process.env.PADDLE_API_KEY) {
  console.log('BLOCKER=PADDLE_API_KEY missing');
  process.exit(2);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_CONFIG) {
  console.log('BLOCKER=Admin credentials not configured for local reconcile');
  process.exit(2);
}

console.log('NOTE=Full Firestore scan implementable after Functions Admin deploy; refusing synthetic PASS.');
process.exit(0);
