/**
 * Credit statement (cari hareket): purchase + spend + admin movements with timestamps.
 * LocalStorage always; Firestore when signed in (same pattern as purchases).
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
import { getPackageByCredits } from '../lib/pricing-packages.js';
import type { PurchaseRecord } from './account-data.js';

const LEDGER_KEY = 'sectorcalc-credit-ledger';

export type CreditMovementKind = 'purchase' | 'spend' | 'refund' | 'admin' | 'promo' | 'sync';

export interface CreditMovement {
  id: string;
  kind: CreditMovementKind;
  /** Signed delta: +credit / −debit */
  delta: number;
  label: string;
  detail?: string;
  toolId?: string;
  txnId: string;
  at: string;
  balanceAfter?: number;
}

export function readLocalLedger(): CreditMovement[] {
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CreditMovement[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalLedger(rows: CreditMovement[]): void {
  localStorage.setItem(LEDGER_KEY, JSON.stringify(rows.slice(0, 200)));
}

function upsertLocal(row: CreditMovement): CreditMovement {
  const next = [row, ...readLocalLedger().filter((r) => r.txnId !== row.txnId && r.id !== row.id)];
  writeLocalLedger(next);
  return row;
}

export function recordLocalMovement(input: {
  kind: CreditMovementKind;
  delta: number;
  label: string;
  detail?: string;
  toolId?: string;
  txnId?: string;
  balanceAfter?: number;
  at?: string;
}): CreditMovement {
  if (!Number.isInteger(input.delta) || input.delta === 0) {
    throw new Error('ledger delta must be a non-zero integer');
  }
  const txnId = input.txnId || `mov_${Date.now()}_${Math.abs(input.delta)}`;
  const existing = readLocalLedger().find((r) => r.txnId === txnId);
  if (existing) return existing;
  const row: CreditMovement = {
    id: `loc_${Date.now()}`,
    kind: input.kind,
    delta: input.delta,
    label: input.label,
    detail: input.detail,
    toolId: input.toolId,
    txnId,
    at: input.at || new Date().toISOString(),
    balanceAfter: input.balanceAfter
  };
  return upsertLocal(row);
}

export async function recordCloudMovement(
  user: User,
  input: {
    kind: CreditMovementKind;
    delta: number;
    label: string;
    detail?: string;
    toolId?: string;
    txnId?: string;
    balanceAfter?: number;
  }
): Promise<void> {
  if (!Number.isInteger(input.delta) || input.delta === 0) return;
  const txnId = input.txnId || `cloud_mov_${Date.now()}`;
  await addDoc(collection(getFirebaseDb(), 'users', user.uid, 'ledger'), {
    kind: input.kind,
    delta: input.delta,
    label: input.label,
    detail: input.detail || '',
    toolId: input.toolId || '',
    txnId,
    balanceAfter: input.balanceAfter ?? null,
    at: serverTimestamp(),
    email: user.email || ''
  });
}

export async function listCloudLedger(uid: string): Promise<CreditMovement[]> {
  const q = query(
    collection(getFirebaseDb(), 'wallets', uid, 'ledger'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const at = data.createdAt as string | Timestamp | undefined;
    const createdAt =
      at && typeof (at as Timestamp).toDate === 'function'
        ? (at as Timestamp).toDate().toISOString()
        : String(at || new Date(0).toISOString());
    const type = String(data.type || 'sync');
    const delta = Number(data.deltaCredits) || 0;
    const toolId = data.toolId ? String(data.toolId) : undefined;
    const { kind, label } = serverLedgerHuman(type, delta, toolId);
    return {
      id: String(data.id || d.id),
      kind,
      delta,
      label,
      toolId,
      txnId: String(data.sourceId || d.id),
      at: createdAt
    };
  });
}

function serverLedgerHuman(
  type: string,
  delta: number,
  toolId?: string
): { kind: CreditMovementKind; label: string } {
  const sign = delta >= 0 ? `+${delta}` : `${delta}`;
  switch (type) {
    case 'PURCHASE_GRANT':
      return { kind: 'purchase', label: `Credit purchase · ${sign} credits` };
    case 'PROMOTIONAL_GRANT':
      return { kind: 'promo', label: `Promotional grant · ${sign} credits` };
    case 'SESSION_DEBIT':
      return { kind: 'spend', label: `${sign} · ${toolId || 'Tool'} professional session` };
    case 'REFUND_REVERSAL':
      return { kind: 'refund', label: `${sign} · Refund reversal` };
    case 'CHARGEBACK_REVERSAL':
      return { kind: 'refund', label: `${sign} · Chargeback reversal` };
    case 'DEBT_CREATED':
      return { kind: 'admin', label: `${sign} · Billing debt created` };
    case 'DEBT_SETTLED':
      return { kind: 'purchase', label: `${sign} · Billing debt settled` };
    case 'ADMIN_ADJUSTMENT':
      return { kind: 'admin', label: `${sign} · Admin adjustment` };
    default:
      return { kind: 'sync', label: `${sign} · ${type}` };
  }
}

/** Purchase rows → synthetic movements (covers history before ledger existed). */
export function purchasesAsMovements(purchases: PurchaseRecord[]): CreditMovement[] {
  return purchases.map((p) => {
    const pack = getPackageByCredits(p.credits);
    return {
      id: `pur_${p.id}`,
      kind: 'purchase' as const,
      delta: p.credits,
      label: pack ? `Credit pack · ${pack.credits} credits` : `Credit purchase · ${p.credits}`,
      detail: p.amountLabel && p.amountLabel !== '—' ? `${p.amountLabel} · ${p.source}` : p.source,
      txnId: p.txnId || p.id,
      at: p.at
    };
  });
}

export function mergeMovements(...groups: CreditMovement[][]): CreditMovement[] {
  const map = new Map<string, CreditMovement>();
  for (const group of groups) {
    for (const row of group) {
      const key = row.txnId || row.id;
      if (!map.has(key)) map.set(key, row);
    }
  }
  return [...map.values()].sort((a, b) => b.at.localeCompare(a.at));
}

/** Fill balanceAfter walking oldest→newest from a known current balance. */
export function withRunningBalance(
  rows: CreditMovement[],
  currentBalance: number
): CreditMovement[] {
  const asc = [...rows].sort((a, b) => a.at.localeCompare(b.at));
  let bal = currentBalance - asc.reduce((n, r) => n + r.delta, 0);
  const stamped = asc.map((r) => {
    bal += r.delta;
    return { ...r, balanceAfter: r.balanceAfter ?? bal };
  });
  return stamped.sort((a, b) => b.at.localeCompare(a.at));
}

export function ledgerTotals(rows: CreditMovement[]): {
  purchased: number;
  spent: number;
  net: number;
} {
  let purchased = 0;
  let spent = 0;
  for (const r of rows) {
    if (r.delta > 0) purchased += r.delta;
    if (r.delta < 0) spent += -r.delta;
  }
  return { purchased, spent, net: purchased - spent };
}

export function recordPurchaseMovement(input: {
  credits: number;
  txnId?: string;
  source?: string;
  balanceAfter?: number;
}): CreditMovement {
  const pack = getPackageByCredits(input.credits);
  return recordLocalMovement({
    kind: 'purchase',
    delta: input.credits,
    label: pack ? `Purchased ${pack.credits} credits` : `Purchased ${input.credits} credits`,
    detail: [pack?.price, input.source].filter(Boolean).join(' · ') || undefined,
    txnId: input.txnId || `purchase_${Date.now()}`,
    balanceAfter: input.balanceAfter
  });
}

export function recordSpendMovement(input: {
  credits: number;
  toolId?: string;
  label?: string;
  detail?: string;
  txnId?: string;
  balanceAfter?: number;
}): CreditMovement {
  const cost = Math.abs(input.credits);
  return recordLocalMovement({
    kind: 'spend',
    delta: -cost,
    label: input.label || (input.toolId ? `Session unlock · ${input.toolId}` : 'Credit spend'),
    detail: input.detail,
    toolId: input.toolId,
    txnId: input.txnId || `spend_${Date.now()}`,
    balanceAfter: input.balanceAfter
  });
}

export async function persistMovement(
  user: User | null,
  input: Parameters<typeof recordLocalMovement>[0]
): Promise<CreditMovement> {
  const local = recordLocalMovement(input);
  if (!user) return local;
  try {
    await recordCloudMovement(user, {
      kind: input.kind,
      delta: input.delta,
      label: input.label,
      detail: input.detail,
      toolId: input.toolId,
      txnId: local.txnId,
      balanceAfter: input.balanceAfter
    });
  } catch {
    /* best-effort cloud mirror */
  }
  return local;
}
