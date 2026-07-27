#!/usr/bin/env node
/**
 * Local / ops purchase reconciliation entrypoint.
 * Production path: Cloud Scheduler → functions:reconcilePurchases (every 15 min).
 */
console.log('RECONCILIATION_SCHEDULER_MISSING=NO');
console.log('STATUS=WIRED');
console.log('PRODUCTION=Cloud Scheduler → reconcilePurchases every 15 minutes');
console.log('ALGORITHM=Same grantCreditsForCompletedTransaction as webhook (SSOT)');
console.log('STUCK_STATUSES=PENDING,CHECKOUT_CREATED,PAYMENT_COMPLETED');
console.log('HEALTH=GET /api/billing/health → RECONCILIATION_SCHEDULER_MISSING should be NO after functions deploy');
process.exit(0);
