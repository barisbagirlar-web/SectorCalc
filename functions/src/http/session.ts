import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { requireUser, sendError } from '../lib/auth';
import { resolveToolCost } from '../domain/packages';
import { openProfessionalSession, type ProfessionalSession } from '../domain/session';
import { monetizationEnabled } from '../lib/config';
import { db, ledgerCol, sessionsCol, walletRef } from '../lib/firestore';
import { emptyWallet } from '../domain/types';

function newId(): string {
  return db().collection('_').doc().id;
}

export async function handleProfessionalSession(req: Request, res: Response, toolId: string): Promise<void> {
  try {
    if (!monetizationEnabled()) {
      res.status(503).json({ error: 'TOOL_NOT_MONETIZED', message: 'CREDIT_MONETIZATION_ENABLED=false' });
      return;
    }
    const user = await requireUser(req);
    const pricing = resolveToolCost(toolId);
    if (!pricing || !pricing.monetizationEnabled) {
      res.status(400).json({ error: 'TOOL_NOT_MONETIZED' });
      return;
    }

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    let resultPayload: Record<string, unknown> | null = null;

    await db().runTransaction(async (tx) => {
      const wRef = walletRef(user.uid);
      const wSnap = await tx.get(wRef);
      const wallet = wSnap.exists
        ? {
            userId: user.uid,
            purchasedCredits: Number(wSnap.data()!.purchasedCredits) || 0,
            promotionalCredits: Number(wSnap.data()!.promotionalCredits) || 0,
            promotionalExpiresAt: (wSnap.data()!.promotionalExpiresAt as string) || null,
            creditDebt: Number(wSnap.data()!.creditDebt) || 0,
            version: Number(wSnap.data()!.version) || 0,
            updatedAt: (wSnap.data()!.updatedAt as string) || nowIso
          }
        : emptyWallet(user.uid, nowIso);

      const activeQ = sessionsCol(user.uid)
        .where('toolId', '==', toolId)
        .where('status', '==', 'ACTIVE')
        .limit(5);
      const activeSnap = await tx.get(activeQ);
      let existing: ProfessionalSession | null = null;
      for (const d of activeSnap.docs) {
        const s = { id: d.id, ...(d.data() as Omit<ProfessionalSession, 'id'>) };
        if (Date.parse(s.expiresAt) > nowMs) {
          existing = s;
          break;
        }
        tx.update(d.ref, { status: 'EXPIRED' });
      }

      const outcome = openProfessionalSession({
        wallet,
        userId: user.uid,
        toolId,
        pricingTier: pricing.tier,
        creditCost: pricing.creditCost,
        monetizationEnabled: true,
        existingActive: existing,
        nowMs,
        idFactory: newId
      });

      if (!outcome.ok) {
        resultPayload = {
          error: outcome.code,
          requiredCredits: outcome.requiredCredits,
          availableCredits: outcome.availableCredits
        };
        return;
      }

      if (!outcome.reused) {
        tx.set(wRef, outcome.wallet, { merge: true });
        for (const e of outcome.ledger) tx.set(ledgerCol(user.uid).doc(e.id), e);
        tx.set(sessionsCol(user.uid).doc(outcome.session.id), {
          ...outcome.session,
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      const promoOk =
        outcome.wallet.promotionalExpiresAt && Date.parse(outcome.wallet.promotionalExpiresAt) > nowMs
          ? outcome.wallet.promotionalCredits
          : 0;
      resultPayload = {
        sessionId: outcome.session.id,
        toolId: outcome.session.toolId,
        startedAt: outcome.session.startedAt,
        expiresAt: outcome.session.expiresAt,
        creditCost: outcome.reused ? 0 : outcome.debit,
        reused: outcome.reused,
        newWalletBalance: outcome.wallet.purchasedCredits + promoOk
      };
    });

    const payload = resultPayload as Record<string, unknown> | null;
    if (payload && typeof payload.error === 'string') {
      const code = payload.error;
      const status = code === 'INSUFFICIENT_CREDITS' || code === 'BILLING_DEBT' ? 402 : 400;
      res.status(status).json(payload);
      return;
    }
    res.status(200).json(payload);
  } catch (err) {
    sendError(res, err);
  }
}
