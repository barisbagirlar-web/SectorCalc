/**
 * Replay-safe purchase reconciliation (scheduled).
 * Same grant path as Paddle webhook — never invents credits.
 */
import type { BillingPurchase, PurchaseStatus } from '../domain/types';
import { db } from '../lib/firestore';
import { getPaddleTransaction } from '../lib/paddle';
import { grantCreditsForCompletedTransaction } from '../lib/grant-service';

const STUCK: PurchaseStatus[] = ['PENDING', 'CHECKOUT_CREATED', 'PAYMENT_COMPLETED'];

export async function runPurchaseReconciliation(): Promise<{
  scanned: number;
  credited: number;
  skipped: number;
  errors: number;
}> {
  let scanned = 0;
  let credited = 0;
  let skipped = 0;
  let errors = 0;

  for (const status of STUCK) {
    const snap = await db()
      .collection('billing_purchases')
      .where('status', '==', status)
      .limit(40)
      .get();

    for (const doc of snap.docs) {
      scanned += 1;
      const purchase = { id: doc.id, ...(doc.data() as object) } as BillingPurchase;
      const txnId = purchase.paddleTransactionId;
      if (!txnId) {
        skipped += 1;
        continue;
      }
      try {
        const live = await getPaddleTransaction(txnId);
        const liveStatus = String(live.status || '');
        if (liveStatus !== 'completed') {
          skipped += 1;
          continue;
        }
        const items = ((live.items as Array<Record<string, unknown>>) || []).map((it) => ({
          price_id: String(it.price_id || (it.price as { id?: string })?.id || ''),
          quantity: Number(it.quantity || 1)
        }));
        const result = await grantCreditsForCompletedTransaction({
          purchase,
          transaction: {
            id: txnId,
            status: liveStatus,
            items,
            custom_data: (live.custom_data as Record<string, string>) || null
          }
        });
        if (result.already) skipped += 1;
        else credited += 1;
      } catch (err) {
        errors += 1;
        console.error('reconcile_purchase_failed', purchase.id, err);
      }
    }
  }

  return { scanned, credited, skipped, errors };
}
