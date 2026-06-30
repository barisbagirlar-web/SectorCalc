import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
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
  | "generic";

export function getCustomerSignInErrorCode(error: unknown): CustomerSignInErrorCode {
  if (error instanceof Error && error.message === "Firebase Auth is not configured.") {
    return "not-configured";
  }

  if (!isAuthError(error)) {
    return "generic";
  }

  if (POPUP_CANCELLED_CODES.has(error.code)) {
    return "cancelled";
  }
  if (error.code === "auth/unauthorized-domain") {
    return "unauthorized-domain";
  }
  if (POPUP_REDIRECT_FALLBACK_CODES.has(error.code)) {
    return "popup-blocked";
  }
  if (error.code === "auth/network-request-failed") {
    return "network";
  }

  return "generic";
}

export async function signInCustomerWithGoogle(): Promise<{ readonly redirected: boolean }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }

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

/**
 * Completes a pending {@link signInWithRedirect} flow.
 *
 * Must run on page load: when the popup is blocked the sign-in falls back to a
 * full redirect to Google and back, and the result is only available via
 * getRedirectResult on return. Without this the redirect flow silently fails.
 *
 * Returns true when a redirect sign-in just completed, false otherwise.
 */
export async function completeCustomerGoogleRedirect(): Promise<boolean> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return false;
  }

  const result = await getRedirectResult(auth);
  return result !== null;
}

/** @deprecated Use getCustomerSignInErrorCode + i18n messages. */
export function mapCustomerSignInError(error: unknown): string {
  const code = getCustomerSignInErrorCode(error);
  if (code === "cancelled") {
    return "Sign-in was cancelled.";
  }
  if (code === "unauthorized-domain") {
    const authDomain = getResolvedFirebaseConfig().authDomain;
    return `Sign-in is not authorized on this domain. Expected Firebase authDomain: ${authDomain}. Add sectorcalc.com to Firebase Authorized domains if missing.`;
  }
  if (code === "popup-blocked") {
    return "Popup was blocked. Redirect sign-in was attempted — if nothing happens, allow popups or try again.";
  }
  if (code === "network") {
    return "Network error during sign-in. Check your connection and try again.";
  }
  if (code === "not-configured") {
    return "Sign-in is unavailable because Firebase Auth is not configured.";
  }
  return "Sign-in failed. Try again.";
}
