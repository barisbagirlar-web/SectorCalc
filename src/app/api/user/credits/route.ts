import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreditData = {
  available: number;
  totalPurchased: number;
  usedThisMonth: number;
};

async function fetchCreditData(uid: string): Promise<CreditData> {
  const db = getAdminFirestore();
  if (!db) {
    return { available: 0, totalPurchased: 0, usedThisMonth: 0 };
  }

  // Current balance
  const balanceRef = db.collection("users").doc(uid).collection("credits").doc("balance");
  const balanceSnap = await balanceRef.get();
  const available =
    balanceSnap.exists && typeof balanceSnap.data()?.amount === "number"
      ? Math.floor(balanceSnap.data()!.amount)
      : 0;

  // Calculate totals from credit transactions
  const transactionsSnap = await db
    .collection("creditTransactions")
    .where("userId", "==", uid)
    .get();

  let totalPurchased = 0;
  let usedThisMonth = 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  for (const doc of transactionsSnap.docs) {
    const data = doc.data();
    const amount = typeof data.credits === "number" ? Math.floor(data.credits) : 0;

    if (data.type === "purchase") {
      totalPurchased += amount;
    } else if (data.type === "spend") {
      if (typeof data.timestamp === "string" && data.timestamp >= monthStart) {
        usedThisMonth += amount;
      }
    }
  }

  return { available, totalPurchased, usedThisMonth };
}

export async function GET(request: Request) {
  const token = parseBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await verifySignedInUser(token);
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const data = await fetchCreditData(user.uid);
  return NextResponse.json(data);
}
