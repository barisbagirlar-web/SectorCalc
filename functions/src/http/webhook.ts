import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { createHmac } from 'node:crypto';
import { webhookEventRef, purchaseRef, db } from '../lib/firestore';
import { grantCreditsForCompletedTransaction } from '../lib/grant-service';
import { getPaddleTransaction } from '../lib/paddle';
import type { BillingPurchase } from '../domain/types';
import { applyPurchaseReversal } from '../domain/grant';
import { emptyWallet } from '../domain/types';
import { ledgerCol, walletRef } from '../lib/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyPaddleSignature } from '../domain/paddle-signature';

function newId(): string {
  return db().collection('_').doc().id;
}

export async function handlePaddleWebhook(req: Request, res: Response): Promise<void> {
  const secret = process.env.PADDLE_WEBHOOK_SECRET || '';
  const raw = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!raw || !Buffer.isBuffer(raw)) {
    res.status(400).json({ error: 'RAW_BODY_REQUIRED' });
    return;
  }
  const sig = req.get('Paddle-Signature') || req.get('paddle-signature') || undefined;
  if (!verifyPaddleSignature(raw, sig, secret)) {
    res.status(401).json({ error: 'INVALID_SIGNATURE' });
    return;
  }

  const event =
    typeof req.body === 'object' && req.body ? req.body : JSON.parse(raw.toString('utf8'));
  const eventId = String(event?.event_id || event?.eventId || '');
  const eventType = String(event?.event_type || event?.eventType || '');
  if (!eventId) {
    res.status(400).json({ error: 'MISSING_EVENT_ID' });
    return;
  }

  const evRef = webhookEventRef(eventId);
  try {
    await evRef.create({
      eventId,
      eventType,
      notificationId: event?.notification_id || null,
      occurredAt: event?.occurred_at || new Date().toISOString(),
      payloadHash: createHmac('sha256', 'sectorcalc').update(raw).digest('hex'),
      processingStatus: 'processing',
      processedAt: null,
      errorCode: null
    });
  } catch {
    const existing = await evRef.get();
    if (existing.exists && existing.data()?.processingStatus === 'processed') {
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }
    // In-flight or failed — allow careful retry only if not processed
  }

  try {
    if (eventType === 'transaction.completed') {
      const data = event.data || {};
      const txnId = String(data.id || '');
      const custom = data.custom_data || {};
      const purchaseId = String(custom.sectorcalc_purchase_id || '');
      let purchaseSnap = purchaseId ? await purchaseRef(purchaseId).get() : null;
      if (!purchaseSnap?.exists && txnId) {
        const q = await db()
          .collection('billing_purchases')
          .where('paddleTransactionId', '==', txnId)
          .limit(1)
          .get();
        purchaseSnap = q.docs[0] || null;
      }
      if (!purchaseSnap || !('exists' in purchaseSnap ? purchaseSnap.exists : true)) {
        await evRef.set(
          { processingStatus: 'awaiting_purchase', errorCode: 'PURCHASE_NOT_FOUND' },
          { merge: true }
        );
        res.status(200).json({ ok: true, pending: 'PURCHASE_NOT_FOUND' });
        return;
      }
      const purchase = {
        id: purchaseSnap.id,
        ...(purchaseSnap.data() as object)
      } as BillingPurchase;
      const txn = {
        id: txnId,
        status: data.status,
        items: (data.details?.line_items || data.items || []).map(
          (li: Record<string, unknown>) => ({
            price_id: String(li.price_id || (li.price as { id?: string })?.id || ''),
            quantity: Number(li.quantity || 1)
          })
        ),
        custom_data: custom
      };
      // Prefer authoritative fetch when API key allows.
      try {
        const live = await getPaddleTransaction(txnId);
        txn.status = String(live.status || txn.status);
        const items = (live.items as Array<Record<string, unknown>>) || [];
        if (items.length) {
          txn.items = items.map((it) => ({
            price_id: String(it.price_id || (it.price as { id?: string })?.id || ''),
            quantity: Number(it.quantity || 1)
          }));
        }
      } catch {
        /* use webhook payload */
      }
      await grantCreditsForCompletedTransaction({ purchase, transaction: txn });
    } else if (eventType === 'adjustment.updated' || eventType === 'adjustment.created') {
      await maybeHandleAdjustment(event.data || {});
    }

    await evRef.set(
      { processingStatus: 'processed', processedAt: new Date().toISOString(), errorCode: null },
      { merge: true }
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'PROCESSING_FAILED';
    await evRef.set({ processingStatus: 'failed', errorCode: msg.slice(0, 200) }, { merge: true });
    res.status(500).json({ error: 'PROCESSING_FAILED', message: msg });
  }
}

async function maybeHandleAdjustment(data: Record<string, unknown>): Promise<void> {
  const action = String(data.action || '');
  const status = String(data.status || '');
  if (status !== 'approved') return;
  if (action !== 'refund' && action !== 'chargeback') return;

  const totals = data.totals as { total?: string } | undefined;
  // Partial refund detection via items if present — V1: if not full package match → REVIEW
  const txnId = String(data.transaction_id || '');
  if (!txnId) return;
  const q = await db()
    .collection('billing_purchases')
    .where('paddleTransactionId', '==', txnId)
    .limit(1)
    .get();
  if (q.empty) return;
  const doc = q.docs[0]!;
  const purchase = { id: doc.id, ...doc.data() } as BillingPurchase;
  if (purchase.status === 'REFUNDED' || purchase.status === 'CHARGEDBACK') return;

  // If adjustment total does not equal known package display, mark review (cannot convert safely).
  // V1 full refund path when credits match expectedCredits historical.
  const reverseCredits = purchase.expectedCredits;
  const kind = action === 'chargeback' ? 'CHARGEBACK_REVERSAL' : 'REFUND_REVERSAL';
  const nowIso = new Date().toISOString();

  await db().runTransaction(async (tx) => {
    const pSnap = await tx.get(doc.ref);
    const p = pSnap.data() as BillingPurchase;
    if (p.status === 'REFUNDED' || p.status === 'CHARGEDBACK') return;
    const wRef = walletRef(p.userId);
    const wSnap = await tx.get(wRef);
    const wallet = wSnap.exists
      ? {
          userId: p.userId,
          purchasedCredits: Number(wSnap.data()!.purchasedCredits) || 0,
          promotionalCredits: Number(wSnap.data()!.promotionalCredits) || 0,
          promotionalExpiresAt: (wSnap.data()!.promotionalExpiresAt as string) || null,
          creditDebt: Number(wSnap.data()!.creditDebt) || 0,
          version: Number(wSnap.data()!.version) || 0,
          updatedAt: (wSnap.data()!.updatedAt as string) || nowIso
        }
      : emptyWallet(p.userId, nowIso);

    // Partial: if Paddle reports a different total than expected package, review.
    if (totals?.total && Number(totals.total) <= 0) {
      tx.update(doc.ref, { status: 'REVIEW_REQUIRED' });
      return;
    }

    const result = applyPurchaseReversal({
      wallet,
      reverseCredits,
      sourceId: String(data.id || txnId),
      nowIso,
      idFactory: newId,
      kind
    });
    tx.set(wRef, result.wallet, { merge: true });
    for (const e of result.ledger) tx.set(ledgerCol(p.userId).doc(e.id), e);
    tx.update(doc.ref, {
      status: kind === 'CHARGEBACK_REVERSAL' ? 'CHARGEDBACK' : 'REFUNDED',
      refundedAt: nowIso,
      updatedAt: FieldValue.serverTimestamp()
    });
  });
}
