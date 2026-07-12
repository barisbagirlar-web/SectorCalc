import {
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

let cachedAuth: Auth | null | undefined;

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
 cachedAuth = getAuth(app);
 } catch {
 cachedAuth = null;
 }

 return cachedAuth;
}

export { onAuthStateChanged, type User };

export async function signInAdminWithEmailPassword(
 email: string,
 password: string
): Promise<User> {
 const auth = getFirebaseAuth();
 if (!auth) {
 throw new Error("Firebase Auth is not configured.");
 }

 const credential = await signInWithEmailAndPassword(
 auth,
    email.trim().toLowerCase(),
    password
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
 await user.getIdToken(true);
 const tokenResult = await user.getIdTokenResult();
 return tokenResult.claims.admin === true;
}

export async function signOutAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }

  // Clear server-side session cookie before Firebase sign-out
  await clearSessionCookie();

  await firebaseSignOut(auth);
}

export async function refreshUserAdminClaim(user: User): Promise<boolean> {
 await user.getIdToken(true);
 const tokenResult = await user.getIdTokenResult();
 return tokenResult.claims.admin === true;
}

export async function getCurrentUserIdToken(
 forceRefresh = false
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
 forceRefresh = false
): Promise<boolean> {
 const auth = getFirebaseAuth();
 const user = auth?.currentUser;
 if (!user) {
 return false;
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

const MAPPED_SIGNIN_CODES: Record<string, string> = {
 "auth/invalid-credential": "Invalid email or password.",
 "auth/wrong-password": "Invalid email or password.",
 "auth/user-not-found": "Invalid email or password.",
 "auth/invalid-email": "Invalid email format.",
 "auth/user-disabled": "This account has been disabled.",
 "auth/operation-not-allowed": "Email/password sign-in is not enabled. Contact support.",
 "auth/too-many-requests": "Too many sign-in attempts. Please wait and try again.",
 "auth/api-key-not-valid": "Authentication service configuration error.",
 "auth/app-not-authorized": "Authentication service configuration error.",
};

export function mapFirebaseSignInError(error: unknown): string {
 const code =
   typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
     ? error.code
     : null;

 // Dev: log real error code so 400 is not blindly assumed to be "wrong password"
 if (code && process.env.NODE_ENV === "development") {
   // eslint-disable-next-line no-console
   console.log(`[mapFirebaseSignInError] Raw Firebase code: ${code}`, error);
 }

 if (code && MAPPED_SIGNIN_CODES[code]) {
   return MAPPED_SIGNIN_CODES[code];
 }

 // Production-safe fallback — no raw code or stack
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
