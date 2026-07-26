/**
 * Firestore user profile (named DB sectorcalc-2).
 */
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from './firebase-app.js';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  credits: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const ref = doc(getFirebaseDb(), 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data() as Partial<UserProfile>;
    return {
      uid: user.uid,
      email: user.email || data.email || '',
      displayName: user.displayName || data.displayName || '',
      photoURL: user.photoURL || data.photoURL || '',
      credits: Number.isInteger(data.credits) ? (data.credits as number) : 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    credits: 0
  };
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return profile;
}

export async function readUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<UserProfile>;
  return {
    uid,
    email: data.email || '',
    displayName: data.displayName || '',
    photoURL: data.photoURL || '',
    credits: Number.isInteger(data.credits) ? (data.credits as number) : 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export async function setUserCredits(uid: string, credits: number): Promise<void> {
  if (!Number.isInteger(credits) || credits < 0) {
    throw new Error('credits must be a non-negative integer');
  }
  await updateDoc(doc(getFirebaseDb(), 'users', uid), {
    credits,
    updatedAt: serverTimestamp()
  });
}
