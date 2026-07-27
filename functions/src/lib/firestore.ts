import { FieldValue, type Transaction } from 'firebase-admin/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import type { CreditLedgerEntry, CreditWallet } from '../domain/types';
import { emptyWallet } from '../domain/types';

const DB = process.env.FIRESTORE_DB || 'sectorcalc-2';

export function db() {
  return getFirestore(DB);
}

export function walletRef(uid: string) {
  return db().doc(`wallets/${uid}`);
}

export function purchaseRef(id: string) {
  return db().doc(`billing_purchases/${id}`);
}

export function webhookEventRef(eventId: string) {
  return db().doc(`paddle_webhook_events/${eventId}`);
}

export function ledgerCol(uid: string) {
  return db().collection(`wallets/${uid}/ledger`);
}

export function sessionsCol(uid: string) {
  return db().collection(`wallets/${uid}/professional_sessions`);
}

export async function readWallet(uid: string): Promise<CreditWallet> {
  const snap = await walletRef(uid).get();
  if (!snap.exists) return emptyWallet(uid, new Date().toISOString());
  const d = snap.data()!;
  return {
    userId: uid,
    purchasedCredits: Number(d.purchasedCredits) || 0,
    promotionalCredits: Number(d.promotionalCredits) || 0,
    promotionalExpiresAt: d.promotionalExpiresAt || null,
    creditDebt: Number(d.creditDebt) || 0,
    version: Number(d.version) || 0,
    updatedAt: d.updatedAt || new Date().toISOString()
  };
}

export async function writeLedgerEntries(
  uid: string,
  entries: CreditLedgerEntry[],
  tx?: Transaction
): Promise<void> {
  for (const e of entries) {
    const ref = ledgerCol(uid).doc(e.id);
    if (tx) tx.set(ref, e);
    else await ref.set(e);
  }
}

export { FieldValue };
