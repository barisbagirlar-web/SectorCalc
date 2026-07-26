/**
 * Auth session helpers — email/password + Google.
 */
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './firebase-app.js';
import { ensureUserProfile } from './profile.js';
import { mergeGuestCreditsOnLogin } from './credit-bridge.js';
import { touchSession } from './account-data.js';

export type AuthListener = (user: User | null) => void;

export function authReady(): boolean {
  return isFirebaseConfigured();
}

async function hydrateSignedIn(user: User): Promise<void> {
  await ensureUserProfile(user);
  await mergeGuestCreditsOnLogin(user.uid);
  try {
    await touchSession(user);
  } catch {
    /* session registry best-effort */
  }
}

export function watchAuth(listener: AuthListener): () => void {
  if (!isFirebaseConfigured()) {
    listener(null);
    return () => undefined;
  }
  return onAuthStateChanged(getFirebaseAuth(), async (user) => {
    if (user) {
      try {
        await hydrateSignedIn(user);
      } catch {
        /* profile/credits best-effort */
      }
    }
    listener(user);
  });
}

export async function signUpEmail(email: string, password: string, displayName?: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  if (displayName?.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  await hydrateSignedIn(cred.user);
  return cred.user;
}

export async function signInEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  await hydrateSignedIn(cred.user);
  return cred.user;
}

export async function signInGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(getFirebaseAuth(), provider);
  await hydrateSignedIn(cred.user);
  return cred.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export function currentUser(): User | null {
  if (!isFirebaseConfigured()) return null;
  return getFirebaseAuth().currentUser;
}

export function friendlyAuthError(err: unknown): string {
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: string }).code) : '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email already has an account. Sign in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Auth. Add localhost and sectorcalc.com.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is disabled in Firebase Console (enable Email/Password and Google).';
    default:
      return err instanceof Error ? err.message : 'Authentication failed.';
  }
}
