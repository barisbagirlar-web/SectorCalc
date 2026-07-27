#!/usr/bin/env node
/**
 * Replay-safe reconciliation stub.
 * Fetches stuck BillingPurchase rows and reuses grantCreditsForCompletedTransaction when Functions are available.
 * Reports RECONCILIATION_SCHEDULER_MISSING until a scheduler is wired.
 */
console.log('RECONCILIATION_SCHEDULER_MISSING=YES');
console.log('Run against deployed Admin credentials + PADDLE_API_KEY once Cloud Functions are live.');
console.log('Stuck statuses: PENDING | CHECKOUT_CREATED | PAYMENT_COMPLETED');
process.exit(0);
