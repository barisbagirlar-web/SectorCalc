import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { requireUser, sendError } from '../lib/auth';
import { readWallet, ledgerCol, sessionsCol } from '../lib/firestore';
import { spendableCredits } from '../domain/types';

export async function handleWallet(req: Request, res: Response): Promise<void> {
  try {
    const user = await requireUser(req);
    const wallet = await readWallet(user.uid);
    const now = Date.now();
    const activeSnap = await sessionsCol(user.uid).where('status', '==', 'ACTIVE').get();
    const activeSessions = activeSnap.docs
      .map((d) => {
        const x = d.data();
        return {
          id: d.id,
          toolId: String(x.toolId || ''),
          expiresAt: String(x.expiresAt || '')
        };
      })
      .filter((s) => s.toolId && Date.parse(s.expiresAt) > now);
    res.status(200).json({
      purchasedCredits: wallet.purchasedCredits,
      promotionalCredits:
        wallet.promotionalExpiresAt && Date.parse(wallet.promotionalExpiresAt) > now
          ? wallet.promotionalCredits
          : 0,
      promotionalExpiresAt: wallet.promotionalExpiresAt,
      creditDebt: wallet.creditDebt,
      spendableCredits: spendableCredits(wallet, now),
      activeSessions
    });
  } catch (err) {
    sendError(res, err);
  }
}

export async function handleWalletTransactions(req: Request, res: Response): Promise<void> {
  try {
    const user = await requireUser(req);
    const limit = Math.min(Number(req.query.limit || 50), 100);
    const snap = await ledgerCol(user.uid).orderBy('createdAt', 'desc').limit(limit).get();
    const rows = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        type: x.type,
        deltaCredits: x.deltaCredits,
        toolId: x.toolId || null,
        createdAt: x.createdAt,
        label: humanLabel(String(x.type), Number(x.deltaCredits), x.toolId)
      };
    });
    res.status(200).json({ transactions: rows });
  } catch (err) {
    sendError(res, err);
  }
}

function humanLabel(type: string, delta: number, toolId?: string): string {
  const sign = delta >= 0 ? `+${delta}` : `${delta}`;
  switch (type) {
    case 'PURCHASE_GRANT':
      return `${sign}   Credit purchase`;
    case 'SESSION_DEBIT':
      return `${sign}   ${toolId || 'Tool'} Professional Session`;
    case 'PROMOTIONAL_GRANT':
      return `${sign}   Promotional credit`;
    case 'REFUND_REVERSAL':
      return `${sign}   Refund reversal`;
    case 'CHARGEBACK_REVERSAL':
      return `${sign}   Chargeback reversal`;
    case 'DEBT_CREATED':
      return `${sign}   Billing debt`;
    case 'DEBT_SETTLED':
      return `${sign}   Debt settled`;
    default:
      return `${sign}   ${type}`;
  }
}
