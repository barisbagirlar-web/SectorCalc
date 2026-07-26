/**
 * Firebase app bootstrap for SectorCalc (Auth + Firestore).
 * Public web config is safe to expose; never put server secrets here.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebasePublicConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function vite(name: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return typeof env?.[name] === 'string' ? env[name]! : '';
}

export function getFirebasePublicConfig(): FirebasePublicConfig {
  return {
    apiKey: vite('VITE_FIREBASE_API_KEY'),
    authDomain: vite('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: vite('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: vite('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: vite('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: vite('VITE_FIREBASE_APP_ID')
  };
}

export function isFirebaseConfigured(): boolean {
  const c = getFirebasePublicConfig();
  return Boolean(c.apiKey && c.authDomain && c.projectId && c.appId);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured (set VITE_FIREBASE_* in .env.local)');
  }
  app = initializeApp(getFirebasePublicConfig());
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  return auth;
}

/** Named Firestore database used by SectorCalc production. */
export function getFirebaseDb(): Firestore {
  if (db) return db;
  const named = vite('VITE_FIREBASE_FIRESTORE_DB') || 'sectorcalc-2';
  db = getFirestore(getFirebaseApp(), named);
  return db;
}
