/**
 * Ops administration data access (Firestore profiles + audit trail).
 * Requires signed-in allowlisted admin + deployed firestore.rules isOpsAdmin().
 */
import {
  addDoc,
  collection,
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from './firebase-app.js';
import { readUserProfile, setUserCredits, type UserProfile } from './profile.js';
import type { PurchaseRecord } from './account-data.js';

export interface OpsPurchaseRow extends PurchaseRecord {
  uid: string;
  email: string;
  displayName: string;
}

export interface OpsAuditEvent {
  id: string;
  action: string;
  actorUid: string;
  actorEmail: string;
  targetUid?: string;
  targetEmail?: string;
  detail?: string;
  at?: Timestamp | null;
}

export async function listUserProfiles(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(getFirebaseDb(), 'users'));
  const rows: UserProfile[] = [];
  snap.forEach((docSnap) => {
    const data = docSnap.data() as Partial<UserProfile>;
    rows.push({
      uid: docSnap.id,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      credits: Number.isInteger(data.credits) ? (data.credits as number) : 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  });
  rows.sort((a, b) => a.email.localeCompare(b.email) || a.uid.localeCompare(b.uid));
  return rows;
}

export async function writeOpsAudit(
  actor: User,
  payload: {
    action: string;
    targetUid?: string;
    targetEmail?: string;
    detail?: string;
  }
): Promise<void> {
  await addDoc(collection(getFirebaseDb(), 'ops_audit'), {
    action: payload.action,
    actorUid: actor.uid,
    actorEmail: actor.email || '',
    targetUid: payload.targetUid || '',
    targetEmail: payload.targetEmail || '',
    detail: payload.detail || '',
    at: serverTimestamp()
  });
}

export async function listOpsAudit(max = 100): Promise<OpsAuditEvent[]> {
  const q = query(collection(getFirebaseDb(), 'ops_audit'), orderBy('at', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      action: String(data.action || ''),
      actorUid: String(data.actorUid || ''),
      actorEmail: String(data.actorEmail || ''),
      targetUid: String(data.targetUid || ''),
      targetEmail: String(data.targetEmail || ''),
      detail: String(data.detail || ''),
      at: (data.at as Timestamp | undefined) || null
    };
  });
}

export async function adminSetUserCredits(
  actor: User,
  uid: string,
  credits: number,
  reason: string
): Promise<UserProfile> {
  const before = await readUserProfile(uid);
  if (!before) throw new Error('User profile not found in Firestore');
  const delta = credits - before.credits;
  await setUserCredits(uid, credits);
  await writeOpsAudit(actor, {
    action: 'credits.set',
    targetUid: uid,
    targetEmail: before.email,
    detail: `${before.credits} → ${credits}${reason ? ` · ${reason}` : ''}`
  });
  if (delta !== 0) {
    try {
      await addDoc(collection(getFirebaseDb(), 'users', uid, 'ledger'), {
        kind: 'admin',
        delta,
        label: delta > 0 ? `Admin credit +${delta}` : `Admin debit ${delta}`,
        detail: reason || `${before.credits} → ${credits}`,
        toolId: '',
        txnId: `admin_${uid}_${before.credits}_to_${credits}_${Date.now()}`,
        balanceAfter: credits,
        at: serverTimestamp(),
        email: before.email || '',
        actorUid: actor.uid,
        actorEmail: actor.email || ''
      });
    } catch {
      /* ledger mirror best-effort */
    }
  }
  const after = await readUserProfile(uid);
  if (!after) throw new Error('User profile missing after update');
  return after;
}

export async function adminAdjustUserCredits(
  actor: User,
  uid: string,
  delta: number,
  reason: string
): Promise<UserProfile> {
  const before = await readUserProfile(uid);
  if (!before) throw new Error('User profile not found in Firestore');
  const next = before.credits + delta;
  if (!Number.isInteger(next) || next < 0) {
    throw new Error('Resulting credits must be a non-negative integer');
  }
  return adminSetUserCredits(actor, uid, next, reason || `delta ${delta >= 0 ? '+' : ''}${delta}`);
}

/** Collection-group scan of purchase receipts (ops admin only). */
export async function listAllPurchases(max = 200): Promise<OpsPurchaseRow[]> {
  const snap = await getDocs(collectionGroup(getFirebaseDb(), 'purchases'));
  const rows: OpsPurchaseRow[] = [];
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const at = data.at as Timestamp | undefined;
    const parent = docSnap.ref.parent.parent;
    rows.push({
      id: docSnap.id,
      uid: parent?.id || '',
      email: String(data.email || ''),
      displayName: String(data.displayName || ''),
      credits: Number(data.credits) || 0,
      amountLabel: String(data.amountLabel || '—'),
      txnId: String(data.txnId || docSnap.id),
      source: String(data.source || 'checkout'),
      at: at && typeof at.toDate === 'function' ? at.toDate().toISOString() : new Date(0).toISOString()
    });
  });
  rows.sort((a, b) => b.at.localeCompare(a.at));
  return rows.slice(0, max);
}

/**
 * Join purchase receipts to Firestore profiles so ops always sees buyer email / name
 * even when older purchase docs omitted identity fields.
 */
export function enrichOpsPurchases(
  rows: OpsPurchaseRow[],
  profiles: UserProfile[]
): OpsPurchaseRow[] {
  const byUid = new Map(profiles.map((p) => [p.uid, p]));
  return rows.map((row) => {
    const profile = byUid.get(row.uid);
    return {
      ...row,
      email: (row.email || profile?.email || '').trim(),
      displayName: (row.displayName || profile?.displayName || '').trim()
    };
  });
}

export function packBuyerSummary(
  rows: OpsPurchaseRow[],
  credits: number
): { sales: number; buyers: Array<{ email: string; displayName: string; uid: string; count: number }> } {
  const matched = rows.filter((r) => r.credits === credits);
  const byBuyer = new Map<string, { email: string; displayName: string; uid: string; count: number }>();
  for (const row of matched) {
    const key = row.uid || row.email || row.txnId;
    const prev = byBuyer.get(key);
    if (prev) {
      prev.count += 1;
      continue;
    }
    byBuyer.set(key, {
      uid: row.uid,
      email: row.email,
      displayName: row.displayName,
      count: 1
    });
  }
  const buyers = [...byBuyer.values()].sort((a, b) =>
    (a.email || a.displayName || a.uid).localeCompare(b.email || b.displayName || b.uid)
  );
  return { sales: matched.length, buyers };
}

export function estimateGmvUsd(rows: OpsPurchaseRow[]): number {
  let sum = 0;
  for (const row of rows) {
    const m = String(row.amountLabel).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
    if (m) sum += Number(m[1]);
  }
  return Math.round(sum * 100) / 100;
}

export function profilesToCsv(rows: UserProfile[]): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = ['uid,email,displayName,credits'];
  for (const r of rows) {
    lines.push([esc(r.uid), esc(r.email), esc(r.displayName), esc(r.credits)].join(','));
  }
  return lines.join('\n');
}

export function downloadTextFile(filename: string, text: string, mime = 'text/csv'): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
