import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/infrastructure/firebase/client";
import { clearSessionCookie } from "@/lib/infrastructure/auth/session-cookie";

export const SUPER_ADMIN_EMAIL = "barisbagirlar@gmail.com";

let cachedAuth: Auth | null | undefined;
let authEmulatorConnected = false;

function resolveLocalAuthEmulatorUrl(): string | null {
  if (typeof window === "undefined") return null;

  const browserHost = window.location.hostname;
  if (browserHost !== "127.0.0.1" && browserHost !== "localhost") return null;

  const rawHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST?.trim();
  if (!rawHost) return null;

  const normalized = rawHost.replace(/^https?:\/\//i, "");
  const separator = normalized.lastIndexOf(":");
  if (separator <= 0) return null;

  const host = normalized.slice(0, separator);
  const port = Number(normalized.slice(separator + 1));
  if ((host !== "127.0.0.1" && host !== "localhost") || !Number.isInteger(port) || port <= 0 || port > 65535) {
    return null;
  }

  return `http://${host}:${port}`;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (cachedAuth !== undefined) {
    return cachedAuth;
  }

  const app = getFirebaseApp();
  if (!app) {
    cachedAuth = null;
    return null;
  }

  try {
    const auth = getAuth(app);
    const emulatorUrl = resolveLocalAuthEmulatorUrl();

    if (emulatorUrl && !authEmulatorConnected) {
      connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
      authEmulatorConnected = true;
    }

    cachedAuth = auth;
  } catch {
    cachedAuth = null;
  }

  return cachedAuth;
}

export { onAuthStateChanged, type User };

export async function signInAdminWithEmailPassword(
  email: string,
  password: string,
): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }

  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password,
  );
  return credential.user;
}

export async function signInAdminWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function verifyUserAdminClaim(user: User): Promise<boolean> {
  if (user.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
    return true;
  }
  await user.getIdToken(true);
  const tokenResult = await user.getIdTokenResult();
  return tokenResult.claims.admin === true;
}

export async function signOutAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }

  await clearSessionCookie();
  await firebaseSignOut(auth);
}

export async function refreshUserAdminClaim(user: User): Promise<boolean> {
  if (user.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
    return true;
  }
  await user.getIdToken(true);
  const tokenResult = await user.getIdTokenResult();
  return tokenResult.claims.admin === true;
}

export async function getCurrentUserIdToken(
  forceRefresh = false,
): Promise<string | null> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) {
    return null;
  }

  try {
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}

export async function getCurrentUserAdminClaim(
  forceRefresh = false,
): Promise<boolean> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) {
    return false;
  }

  if (user.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
    return true;
  }

  try {
    if (forceRefresh) {
      await user.getIdToken(true);
    }
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.admin === true;
  } catch {
    return false;
  }
}

const INVALID_CREDENTIAL_CODES = new Set([
  "auth/invalid-credential",
  "auth/wrong-password",
  "auth/user-not-found",
  "auth/invalid-email",
]);

export function mapFirebaseSignInError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    INVALID_CREDENTIAL_CODES.has(error.code)
  ) {
    return "Invalid email or password.";
  }

  return "An error occurred during sign in.";
}

const GOOGLE_POPUP_CANCELLED_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

export function mapGoogleSignInError(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    GOOGLE_POPUP_CANCELLED_CODES.has(error.code)
  ) {
    return null;
  }

  return "An error occurred during Google sign in.";
}
