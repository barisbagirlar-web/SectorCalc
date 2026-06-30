import {
 cert,
 getApps,
 initializeApp,
 type App,
 type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function parseServiceAccountJson(): Record<string, string> | null {
 const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
 if (!raw) {
 return null;
 }
 try {
 const parsed: unknown = JSON.parse(raw);
 if (!parsed || typeof parsed !== "object") {
 return null;
 }
 return parsed as Record<string, string>;
 } catch {
 return null;
 }
}

export function getFirebaseAdminApp(): App | null {
 const existing = getApps()[0];
 if (existing) {
 return existing;
 }

 const serviceAccount = parseServiceAccountJson();
 if (!serviceAccount) {
 return null;
 }

 return initializeApp({
 credential: cert(serviceAccount as ServiceAccount),
 });
}

export function getAdminFirestore(): Firestore | null {
 const app = getFirebaseAdminApp();
 if (!app) {
 return null;
 }
 return getFirestore(app);
}
