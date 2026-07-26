/**
 * Premium account data: purchases, sessions, preferences.
 * Cloud when signed in; localStorage always as durable client ledger.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from './firebase-app.js';
import { getPackageByCredits } from '../lib/pricing-packages.js';

const PURCHASE_KEY = 'sectorcalc-purchases';
const PREFS_KEY = 'sectorcalc-prefs';
const SESSION_KEY = 'sectorcalc-session-id';

export interface PurchaseRecord {
  id: string;
  credits: number;
  amountLabel: string;
  txnId: string;
  source: string;
  at: string;
}

export interface DeviceSession {
  id: string;
  label: string;
  userAgent: string;
  createdAt: string;
  lastSeenAt: string;
  current: boolean;
}

export interface AccountPrefs {
  emailProduct: boolean;
  emailReceipts: boolean;
  compactWorkspace: boolean;
}

export const DEFAULT_PREFS: AccountPrefs = {
  emailProduct: true,
  emailReceipts: true,
  compactWorkspace: false
};

function browserLabel(): string {
  const ua = navigator.userAgent;
  const os = /Mac/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Device';
  const br = /Edg\//.test(ua)
    ? 'Edge'
    : /Chrome\//.test(ua)
      ? 'Chrome'
      : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Safari\//.test(ua)
          ? 'Safari'
          : 'Browser';
  return `${br} · ${os}`;
}

export function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `ses_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `ses_${Date.now()}`;
  }
}

export function readLocalPurchases(): PurchaseRecord[] {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PurchaseRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalPurchases(rows: PurchaseRecord[]): void {
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(rows.slice(0, 100)));
}

export function recordLocalPurchase(input: {
  credits: number;
  txnId?: string;
  source?: string;
}): PurchaseRecord {
  const pack = getPackageByCredits(input.credits);
  const row: PurchaseRecord = {
    id: `loc_${Date.now()}`,
    credits: input.credits,
    amountLabel: pack?.price || '—',
    txnId: input.txnId || `local-${Date.now()}`,
    source: input.source || 'checkout',
    at: new Date().toISOString()
  };
  const next = [row, ...readLocalPurchases().filter((p) => p.txnId !== row.txnId)];
  writeLocalPurchases(next);
  return row;
}

export async function recordCloudPurchase(
  user: User,
  input: { credits: number; txnId?: string; source?: string }
): Promise<void> {
  const pack = getPackageByCredits(input.credits);
  const txnId = input.txnId || `cloud-${Date.now()}`;
  await addDoc(collection(getFirebaseDb(), 'users', user.uid, 'purchases'), {
    credits: input.credits,
    amountLabel: pack?.price || '—',
    txnId,
    source: input.source || 'checkout',
    at: serverTimestamp(),
    email: user.email || ''
  });
}

export async function listCloudPurchases(uid: string): Promise<PurchaseRecord[]> {
  const q = query(
    collection(getFirebaseDb(), 'users', uid, 'purchases'),
    orderBy('at', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const at = data.at as Timestamp | undefined;
    return {
      id: d.id,
      credits: Number(data.credits) || 0,
      amountLabel: String(data.amountLabel || '—'),
      txnId: String(data.txnId || d.id),
      source: String(data.source || 'checkout'),
      at: at && typeof at.toDate === 'function' ? at.toDate().toISOString() : new Date().toISOString()
    };
  });
}

export function mergePurchases(cloud: PurchaseRecord[], local: PurchaseRecord[]): PurchaseRecord[] {
  const map = new Map<string, PurchaseRecord>();
  for (const row of [...cloud, ...local]) {
    const key = row.txnId || row.id;
    if (!map.has(key)) map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.at.localeCompare(a.at));
}

export function readPrefs(): AccountPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<AccountPrefs>) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function writePrefs(prefs: AccountPrefs): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function syncPrefsToCloud(uid: string, prefs: AccountPrefs): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'users', uid), {
    prefs,
    updatedAt: serverTimestamp()
  });
}

export async function touchSession(user: User): Promise<DeviceSession> {
  const id = getOrCreateSessionId();
  const now = new Date().toISOString();
  const row: DeviceSession = {
    id,
    label: browserLabel(),
    userAgent: navigator.userAgent.slice(0, 240),
    createdAt: now,
    lastSeenAt: now,
    current: true
  };
  await setDoc(
    doc(getFirebaseDb(), 'users', user.uid, 'sessions', id),
    {
      label: row.label,
      userAgent: row.userAgent,
      createdAt: row.createdAt,
      lastSeenAt: serverTimestamp(),
      currentHint: true
    },
    { merge: true }
  );
  return row;
}

export async function listSessions(uid: string): Promise<DeviceSession[]> {
  const current = getOrCreateSessionId();
  const snap = await getDocs(collection(getFirebaseDb(), 'users', uid, 'sessions'));
  const rows: DeviceSession[] = snap.docs.map((d) => {
    const data = d.data();
    const last = data.lastSeenAt as Timestamp | undefined;
    return {
      id: d.id,
      label: String(data.label || 'Device'),
      userAgent: String(data.userAgent || ''),
      createdAt: String(data.createdAt || ''),
      lastSeenAt:
        last && typeof last.toDate === 'function' ? last.toDate().toISOString() : String(data.lastSeenAt || ''),
      current: d.id === current
    };
  });
  rows.sort((a, b) => Number(b.current) - Number(a.current) || b.lastSeenAt.localeCompare(a.lastSeenAt));
  return rows;
}

export async function revokeSession(uid: string, sessionId: string): Promise<void> {
  if (sessionId === getOrCreateSessionId()) {
    throw new Error('Cannot revoke the current session from here — use Sign out.');
  }
  await deleteDoc(doc(getFirebaseDb(), 'users', uid, 'sessions', sessionId));
}
