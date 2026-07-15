import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";

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

  // Priority 1: service account JSON from env var (local dev, CI, manual config)
  const serviceAccount = parseServiceAccountJson();
  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
  }

  // Priority 2: Application Default Credentials (Cloud Functions, GCP,
  // App Engine, Cloud Run, Compute Engine). This is the production path when
  // FIREBASE_SERVICE_ACCOUNT_JSON is not set.
  try {
    return initializeApp();
  } catch {
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }
  return getFirestore(app);
}

export function getAdminAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }
  return getAuth(app);
}

export function getAdminStorage(): Storage | null {
  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }
  return getStorage(app);
}

export function getAdminStorage(): Storage | null {
 const app = getFirebaseAdminApp();
 if (!app) {
 return null;
 }
 return getStorage(app);
}
