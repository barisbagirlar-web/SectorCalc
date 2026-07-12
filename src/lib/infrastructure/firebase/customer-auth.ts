import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { getResolvedFirebaseConfig } from "@/lib/infrastructure/firebase/client";

const POPUP_CANCELLED_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

const POPUP_REDIRECT_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/operation-not-supported-in-this-environment",
]);

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as AuthError).code === "string"
  );
}

function shouldFallbackToRedirect(error: unknown): boolean {
  return isAuthError(error) && POPUP_REDIRECT_FALLBACK_CODES.has(error.code);
}

export type CustomerSignInErrorCode =
  | "cancelled"
  | "unauthorized-domain"
  | "popup-blocked"
  | "network"
  | "not-configured"
  | "invalid-email"
  | "user-not-found"
  | "wrong-password"
  | "email-already-in-use"
  | "weak-password"
  | "user-disabled"
  | "operation-not-allowed"
  | "too-many-requests"
  | "invalid-api-key"
  | "app-not-authorized"
  | "generic";

export function getCustomerSignInErrorCode(error: unknown): CustomerSignInErrorCode {
  if (error instanceof Error && error.message === "Firebase Auth is not configured.") {
    return "not-configured";
  }

  if (!isAuthError(error)) {
    return "generic";
  }

  if (POPUP_CANCELLED_CODES.has(error.code)) return "cancelled";
  if (error.code === "auth/unauthorized-domain") return "unauthorized-domain";
  if (POPUP_REDIRECT_FALLBACK_CODES.has(error.code)) return "popup-blocked";
  if (error.code === "auth/network-request-failed") return "network";
  if (error.code === "auth/invalid-email") return "invalid-email";
  if (error.code === "auth/user-not-found") return "user-not-found";
  if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") return "wrong-password";
  if (error.code === "auth/email-already-in-use" || error.code === "auth/account-exists-with-different-credential") return "email-already-in-use";
  if (error.code === "auth/weak-password") return "weak-password";
  if (error.code === "auth/user-disabled") return "user-disabled";
  if (error.code === "auth/operation-not-allowed") return "operation-not-allowed";
  if (error.code === "auth/too-many-requests") return "too-many-requests";
  if (error.code === "auth/api-key-not-valid") return "invalid-api-key";
  if (error.code === "auth/app-not-authorized") return "app-not-authorized";

  return "generic";
}

export function getCustomerSignInErrorMessage(error: unknown): string {
  const code = getCustomerSignInErrorCode(error);
  const messages: Record<CustomerSignInErrorCode, string> = {
    cancelled: "Sign-in was cancelled.",
    "unauthorized-domain": "This domain is not authorized for Firebase sign-in.",
    "popup-blocked": "The sign-in popup was blocked. Allow popups and try again.",
    network: "Network error during sign-in. Check your connection and try again.",
    "not-configured": "Firebase authentication is not configured.",
    "invalid-email": "Enter a valid email address.",
    "user-not-found": "No email/password account was found. Use Google sign-in or create an account.",
    "wrong-password": "The email or password is incorrect. Use password reset if needed.",
    "email-already-in-use": "This email already belongs to an account. Sign in with its existing method.",
    "weak-password": "Use a stronger password with at least six characters.",
    "user-disabled": "This account is disabled. Contact support.",
    "operation-not-allowed": "Email/password sign-in is disabled in Firebase Authentication.",
    "too-many-requests": "Too many attempts. Wait briefly or reset your password.",
    "invalid-api-key": "The Firebase API key is invalid.",
    "app-not-authorized": "This application is not authorized to use Firebase Authentication.",
    generic: "Authentication failed. Check the browser console for the Firebase error code.",
  };
  return messages[code];
}

export async function signInCustomerWithGoogle(): Promise<{ readonly redirected: boolean }> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not configured.");

  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    return { redirected: false };
  } catch (error) {
    if (shouldFallbackToRedirect(error)) {
      await signInWithRedirect(auth, provider);
      return { redirected: true };
    }
    throw error;
  }
}

export async function signInCustomerWithEmail(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not configured.");
  await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
}

export async function signUpCustomerWithEmail(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not configured.");
  await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
}

export async function sendCustomerPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not configured.");
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

export async function completeCustomerGoogleRedirect(): Promise<boolean> {
  const auth = getFirebaseAuth();
  if (!auth) return false;
  const result = await getRedirectResult(auth);
  return result !== null;
}

/** @deprecated Use getCustomerSignInErrorMessage. */
export function mapCustomerSignInError(error: unknown): string {
  const code = getCustomerSignInErrorCode(error);
  if (code === "unauthorized-domain") {
    const authDomain = getResolvedFirebaseConfig().authDomain;
    return `Sign-in is not authorized on this domain. Expected Firebase authDomain: ${authDomain}.`;
  }
  return getCustomerSignInErrorMessage(error);
}
