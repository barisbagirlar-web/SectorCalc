import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { isCreditPackageKey } from '../domain/packages';
import { sanitizeReturnTo } from '../domain/return-to';
import { requireUser, sendError } from '../lib/auth';
import { monetizationEnabled, resolvePackage } from '../lib/config';
import {
  createPaddleTransaction,
  isPaddleApiError,
  newCorrelationId,
  toCheckoutFailurePayload
} from '../lib/paddle';
import { db, purchaseRef } from '../lib/firestore';
import { checkRateLimit } from '../lib/rate-limit';

export async function handleCheckout(req: Request, res: Response): Promise<void> {
  try {
    if (!monetizationEnabled()) {
      res.status(503).json({
        error: 'PADDLE_CONFIGURATION_ERROR',
        message: 'CREDIT_MONETIZATION_ENABLED=false'
      });
      return;
    }
    const user = await requireUser(req);
    if (!checkRateLimit(`checkout:${user.uid}`, 30, 60_000)) {
      res.status(429).json({ error: 'RATE_LIMITED' });
      return;
    }
    const body = (req.body || {}) as { packageKey?: string; returnTo?: string };
    if (!isCreditPackageKey(body.packageKey)) {
      res.status(400).json({ error: 'INVALID_PACKAGE' });
      return;
    }
    const pkg = resolvePackage(body.packageKey);
    const returnTo = sanitizeReturnTo(body.returnTo, [
      'https://sectorcalc.com',
      'https://www.sectorcalc.com',
      'https://sectorcalc-prod.web.app'
    ]);

    const correlationId = newCorrelationId();
    const purchaseId = db().collection('billing_purchases').doc().id;
    const nowIso = new Date().toISOString();
    await purchaseRef(purchaseId).set({
      id: purchaseId,
      userId: user.uid,
      packageKey: pkg.key,
      expectedCredits: pkg.credits,
      expectedPaddlePriceId: pkg.priceId,
      paddleTransactionId: null,
      status: 'PENDING',
      createdAt: nowIso,
      completedAt: null,
      creditedAt: null,
      refundedAt: null,
      returnTo,
      errorCode: null,
      paddleRequestId: null,
      correlationId
    });

    let txn: { id: string };
    try {
      txn = await createPaddleTransaction({
        priceId: pkg.priceId,
        purchaseId,
        packageKey: pkg.key,
        userId: user.uid,
        correlationId
      });
    } catch (err) {
      const failure = isPaddleApiError(err)
        ? { errorCode: err.paddleCode ?? null, paddleRequestId: err.requestId ?? null }
        : { errorCode: null, paddleRequestId: null };
      try {
        await purchaseRef(purchaseId).update({
          status: 'FAILED',
          ...failure,
          updatedAt: FieldValue.serverTimestamp()
        });
      } catch (updateErr) {
        console.error('checkout_failed_mark_failed', { purchaseId, updateErr });
      }
      throw err;
    }

    await purchaseRef(purchaseId).update({
      paddleTransactionId: txn.id,
      status: 'CHECKOUT_CREATED',
      updatedAt: FieldValue.serverTimestamp()
    });

    res.status(200).json({
      purchaseId,
      paddleTransactionId: txn.id
    });
  } catch (err) {
    const payload = toCheckoutFailurePayload(err);
    if (payload) {
      res.status(502).json(payload);
      return;
    }
    sendError(res, err);
  }
}
