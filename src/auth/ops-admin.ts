/**
 * Ops administration data access (Firestore profiles + audit trail).
 * Requires signed-in allowlisted admin + deployed firestore.rules isOpsAdmin().
 */
import {
  addDoc,
  collection,
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
  await setUserCredits(uid, credits);
  await writeOpsAudit(actor, {
    action: 'credits.set',
    targetUid: uid,
    targetEmail: before.email,
    detail: `${before.credits} → ${credits}${reason ? ` · ${reason}` : ''}`
  });
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
