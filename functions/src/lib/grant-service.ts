/**
 * Single domain entry for credit grant (webhook + reconciliation).
 */
import { FieldValue } from 'firebase-admin/firestore';
import { applyPurchaseGrant } from '../domain/grant';
import type { BillingPurchase } from '../domain/types';
import { emptyWallet } from '../domain/types';
import { CREDIT_PACKAGES, type CreditPackageKey, isCreditPackageKey } from '../domain/packages';
import { db, ledgerCol, purchaseRef, walletRef } from './firestore';

function newId(): string {
  return db().collection('_').doc().id;
}

export interface TransactionLike {
  id: string;
  status?: string;
  items?: Array<{ price_id?: string; priceId?: string; quantity?: number }>;
  custom_data?: Record<string, string> | null;
}

export async function grantCreditsForCompletedTransaction(input: {
  purchase: BillingPurchase;
  transaction: TransactionLike;
}): Promise<{ already: boolean; granted: number }> {
  const { purchase, transaction } = input;
  if (purchase.status === 'CREDITED') return { already: true, granted: 0 };
  if (transaction.status && transaction.status !== 'completed') {
    throw new Error(`Transaction not completed: ${transaction.status}`);
  }

  const items = transaction.items || [];
  if (items.length !== 1) throw new Error('Expected exactly one transaction item');
  const item = items[0]!;
  const priceId = item.price_id || item.priceId || '';
  const qty = item.quantity ?? 1;
  if (qty !== 1) throw new Error('quantity must be 1');
  if (priceId !== purchase.expectedPaddlePriceId) {
    throw new Error(`price mismatch: ${priceId} != ${purchase.expectedPaddlePriceId}`);
  }
  if (!isCreditPackageKey(purchase.packageKey)) throw new Error('invalid packageKey');
  const expectedCredits = CREDIT_PACKAGES[purchase.packageKey as CreditPackageKey].credits;
  if (expectedCredits !== purchase.expectedCredits) {
    throw new Error('purchase expectedCredits mismatch vs SSOT');
  }

  const nowIso = new Date().toISOString();
  let granted = 0;

  await db().runTransaction(async (tx) => {
    const pRef = purchaseRef(purchase.id);
    const pSnap = await tx.get(pRef);
    if (!pSnap.exists) throw new Error('purchase missing');
    const pData = pSnap.data() as BillingPurchase;
    if (pData.status === 'CREDITED') return;

    const wRef = walletRef(purchase.userId);
    const wSnap = await tx.get(wRef);
    const wallet = wSnap.exists
      ? {
          userId: purchase.userId,
          purchasedCredits: Number(wSnap.data()!.purchasedCredits) || 0,
          promotionalCredits: Number(wSnap.data()!.promotionalCredits) || 0,
          promotionalExpiresAt: (wSnap.data()!.promotionalExpiresAt as string) || null,
          creditDebt: Number(wSnap.data()!.creditDebt) || 0,
          version: Number(wSnap.data()!.version) || 0,
          updatedAt: (wSnap.data()!.updatedAt as string) || nowIso
        }
      : emptyWallet(purchase.userId, nowIso);

    const result = applyPurchaseGrant({
      wallet,
      grantCredits: expectedCredits,
      sourceId: transaction.id,
      nowIso,
      idFactory: newId
    });
    granted = expectedCredits;

    tx.set(wRef, result.wallet, { merge: true });
    for (const entry of result.ledger) {
      tx.set(ledgerCol(purchase.userId).doc(entry.id), entry);
    }
    tx.update(pRef, {
      status: 'CREDITED',
      paddleTransactionId: transaction.id,
      completedAt: nowIso,
      creditedAt: nowIso,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return { already: false, granted };
}
