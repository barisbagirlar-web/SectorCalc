import * as admin from "firebase-admin";
import {
  CREDIT_TRANSACTIONS_COLLECTION,
  USERS_COLLECTION,
  USER_CREDITS_SUBCOLLECTION,
  USER_CREDIT_BALANCE_DOC,
} from "./constants";

export type CreditTransactionType = "purchase" | "spend";

export interface CreditTransactionRecord {
  userId: string;
  type: CreditTransactionType;
  credits: number;
  stripeSessionId?: string;
  toolSlug?: string;
  timestamp: string;
}

if (!admin.apps.length) {
  admin.initializeApp();
}

export async function getUserCreditBalance(uid: string): Promise<number> {
  const db = admin.firestore();
  const snap = await db
    .collection(USERS_COLLECTION)
    .doc(uid)
    .collection(USER_CREDITS_SUBCOLLECTION)
    .doc(USER_CREDIT_BALANCE_DOC)
    .get();

  const amount = snap.data()?.amount;
  return typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
}

export async function recordCreditTransaction(
  record: CreditTransactionRecord
): Promise<void> {
  const db = admin.firestore();
  await db.collection(CREDIT_TRANSACTIONS_COLLECTION).add(record);
}

export async function addUserCredits(
  uid: string,
  amount: number,
  options?: { stripeSessionId?: string }
): Promise<number> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Credit amount must be a positive number.");
  }

  const db = admin.firestore();
  const ref = db
    .collection(USERS_COLLECTION)
    .doc(uid)
    .collection(USER_CREDITS_SUBCOLLECTION)
    .doc(USER_CREDIT_BALANCE_DOC);

  const nextBalance = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current =
      snap.exists && typeof snap.data()?.amount === "number"
        ? snap.data()!.amount
        : 0;
    const next = current + amount;
    tx.set(
      ref,
      {
        amount: next,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return next;
  });

  await recordCreditTransaction({
    userId: uid,
    type: "purchase",
    credits: amount,
    stripeSessionId: options?.stripeSessionId,
    timestamp: new Date().toISOString(),
  });

  return nextBalance;
}

export async function deductUserCredits(
  uid: string,
  amount: number,
  options?: { toolSlug?: string }
): Promise<boolean> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Credit amount must be a positive number.");
  }

  const db = admin.firestore();
  const ref = db
    .collection(USERS_COLLECTION)
    .doc(uid)
    .collection(USER_CREDITS_SUBCOLLECTION)
    .doc(USER_CREDIT_BALANCE_DOC);

  const deducted = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current =
      snap.exists && typeof snap.data()?.amount === "number"
        ? snap.data()!.amount
        : 0;
    if (current < amount) {
      return false;
    }
    tx.set(
      ref,
      {
        amount: current - amount,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  });

  if (deducted) {
    await recordCreditTransaction({
      userId: uid,
      type: "spend",
      credits: amount,
      toolSlug: options?.toolSlug,
      timestamp: new Date().toISOString(),
    });
  }

  return deducted;
}
