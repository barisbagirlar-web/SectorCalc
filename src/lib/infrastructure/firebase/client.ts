import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

/**
 * Firebase Web config is public client configuration.
 * Never place service account credentials here.
 *
 * NEXT_PUBLIC_* env vars override fallbacks when non-empty at build time.
 */
const FIREBASE_CONFIG_FALLBACK = {
  apiKey: "AIzaSyCYQPcUivyeIio80gxEm8DbFhWV6XEXs78",
  authDomain: "sectorcalc-bf412.firebaseapp.com",
  projectId: "sectorcalc-bf412",
  storageBucket: "sectorcalc-bf412.firebasestorage.app",
  messagingSenderId: "1036979054000",
  appId: "1:1036979054000:web:a317123fd6ff1c9336a275",
} as const;

function resolvePublicEnv(
  envValue: string | undefined,
  fallback: string,
): string {
  if (typeof envValue === "string") {
    const trimmed = envValue.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return fallback;
}

export const firebaseConfig = {
  apiKey: resolvePublicEnv(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_CONFIG_FALLBACK.apiKey,
  ),
  authDomain: resolvePublicEnv(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_CONFIG_FALLBACK.authDomain,
  ),
  projectId: resolvePublicEnv(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_CONFIG_FALLBACK.projectId,
  ),
  storageBucket: resolvePublicEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_CONFIG_FALLBACK.storageBucket,
  ),
  messagingSenderId: resolvePublicEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_CONFIG_FALLBACK.messagingSenderId,
  ),
  appId: resolvePublicEnv(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_CONFIG_FALLBACK.appId,
  ),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId,
);

export function getFirebaseProjectId(): string | null {
  return firebaseConfig.projectId ?? null;
}

export function getResolvedFirebaseConfig(): Readonly<typeof firebaseConfig> {
  return firebaseConfig;
}

let cachedApp: FirebaseApp | null | undefined;
let cachedDb: Firestore | null | undefined;
let firestoreEmulatorConnected = false;

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}

function resolveLocalFirestoreEmulator(): { host: string; port: number } | null {
  if (!isBrowserRuntime()) return null;

  const browserHost = window.location.hostname;
  if (browserHost !== "127.0.0.1" && browserHost !== "localhost") return null;

  const rawHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST?.trim();
  if (!rawHost) return null;

  const normalized = rawHost.replace(/^https?:\/\//i, "");
  const separator = normalized.lastIndexOf(":");
  if (separator <= 0) return null;

  const host = normalized.slice(0, separator);
  const port = Number(normalized.slice(separator + 1));
  if ((host !== "127.0.0.1" && host !== "localhost") || !Number.isInteger(port) || port <= 0 || port > 65535) {
    return null;
  }

  return { host, port };
}

/**
 * Returns a Firebase app in the browser when config is resolved.
 * Never throws; returns null when unconfigured or during SSR.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured || !isBrowserRuntime()) {
    return null;
  }

  if (cachedApp !== undefined) {
    return cachedApp;
  }

  try {
    cachedApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  } catch {
    cachedApp = null;
  }

  return cachedApp;
}

/**
 * Returns Firestore in the browser when Firebase is configured.
 * Never throws; returns null when unavailable.
 */
export function getFirestoreDb(): Firestore | null {
  if (!isFirebaseConfigured || !isBrowserRuntime()) {
    return null;
  }

  if (cachedDb !== undefined) {
    return cachedDb;
  }

  const app = getFirebaseApp();
  if (!app) {
    cachedDb = null;
    return null;
  }

  try {
    const db = getFirestore(app);
    const emulator = resolveLocalFirestoreEmulator();

    if (emulator && !firestoreEmulatorConnected) {
      connectFirestoreEmulator(db, emulator.host, emulator.port);
      firestoreEmulatorConnected = true;
    }

    cachedDb = db;
  } catch {
    cachedDb = null;
  }

  return cachedDb;
}
