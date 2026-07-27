import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { requireUser, sendError } from '../lib/auth';
import { purchaseRef } from '../lib/firestore';

export async function handlePurchaseStatus(req: Request, res: Response, purchaseId: string): Promise<void> {
  try {
    const user = await requireUser(req);
    const snap = await purchaseRef(purchaseId).get();
    if (!snap.exists) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    const p = snap.data()!;
    if (p.userId !== user.uid) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    res.status(200).json({
      purchaseId: p.id,
      status: p.status,
      packageKey: p.packageKey,
      expectedCredits: p.expectedCredits,
      creditedAt: p.creditedAt,
      returnTo: p.returnTo
    });
  } catch (err) {
    sendError(res, err);
  }
}
