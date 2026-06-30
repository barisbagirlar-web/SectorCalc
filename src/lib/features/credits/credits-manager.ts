import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/infrastructure/firebase/client";

const CREDITS_COLLECTION = "credits";
const BALANCE_DOC = "balance";

export async function getUserCredits(userId: string): Promise<number> {
  const db = getFirestoreDb();
  if (!db) {
    return 0;
  }

  const ref = doc(db, "users", userId, CREDITS_COLLECTION, BALANCE_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return 0;
  }

  const amount = snap.data().amount;
  return typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
}
