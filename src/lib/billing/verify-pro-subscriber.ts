import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/firebase/admin";
import {
 hasProAccess,
 isDevelopmentProBypass,
 isProBypassEmail,
 normalizeUserSubscription,
} from "@/lib/billing/subscription";

/** Verify Firebase ID token and return uid when user has Pro access. */
export async function verifyProSubscriber(idToken: string): Promise<string | null> {
 if (!idToken.trim()) {
 return null;
 }

 try {
 const app = getFirebaseAdminApp();
 if (!app) {
 return null;
 }

 const decoded = await getAuth(app).verifyIdToken(idToken);
 if (!decoded?.uid) {
 return null;
 }

 if (isDevelopmentProBypass() || isProBypassEmail(decoded.email)) {
 return decoded.uid;
 }

 const db = getAdminFirestore();
 if (!db) {
 return null;
 }

 const userDoc = await db.collection("users").doc(decoded.uid).get();
 if (!userDoc.exists) {
 return null;
 }

 const subscription = normalizeUserSubscription(userDoc.data()?.subscription);
 if (!hasProAccess(subscription, decoded.email)) {
 return null;
 }

 return decoded.uid;
 } catch {
 return null;
 }
}
