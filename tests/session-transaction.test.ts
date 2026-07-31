import { describe, expect, it, vi } from 'vitest';
import {
  executeProfessionalSessionTx,
  type ProfessionalSessionTx,
  type ProfessionalSessionTxRefs,
  type SessionDocSnapshotLike,
  type SessionQuerySnapshotLike
} from '../functions/src/http/session';

// CI does not install functions dependencies, so Firebase runtime modules are
// mocked: the tests exercise only the pure transaction core, never the handler.
vi.mock('../functions/src/lib/firestore', () => ({
  db: vi.fn(() => ({ collection: () => ({ doc: () => ({ id: 'mock-id' }) }) })),
  walletRef: vi.fn((uid: string) => `wallet:${uid}`),
  ledgerCol: vi.fn((uid: string) => ({ doc: (id: string) => `ledger:${uid}/${id}` })),
  sessionsCol: vi.fn((uid: string) => ({
    where: vi.fn().mockReturnThis(),
    doc: (id: string) => `session:${uid}/${id}`
  })),
  entitlementRef: vi.fn((id: string) => `ent:${id}`),
  FieldValue: { serverTimestamp: () => 'SERVER_TS' }
}));
vi.mock('../functions/src/lib/auth', () => ({
  requireUser: vi.fn(),
  sendError: vi.fn()
}));
vi.mock('../functions/src/lib/config', () => ({
  monetizationEnabled: () => true
}));
vi.mock('../functions/src/lib/entitlement-log', () => ({
  correlationIdFrom: () => 'corr-test',
  logEntitlement: vi.fn(),
  uidHash: (uid: string) => uid
}));

const NOW_MS = Date.UTC(2026, 6, 31, 10, 0, 0);
const NOW_ISO = new Date(NOW_MS).toISOString();
const FUTURE_ISO = new Date(NOW_MS + 24 * 60 * 60 * 1000).toISOString();
const PAST_ISO = new Date(NOW_MS - 60 * 1000).toISOString();

const PRICING = { tier: 'ADVANCED' as const, creditCost: 15, monetizationEnabled: true };

function refs(overrides: Partial<ProfessionalSessionTxRefs> = {}): ProfessionalSessionTxRefs {
  return {
    walletRef: 'wallet',
    activeSessionsQuery: 'activeQ',
    entitlementRef: 'ent',
    ledgerDoc: (id) => `ledger:${id}`,
    sessionDoc: (id) => `session:${id}`,
    ...overrides
  };
}

function baseCtx(overrides: Partial<Parameters<typeof executeProfessionalSessionTx>[2]> = {}) {
  let n = 0;
  return {
    userId: 'u1',
    toolId: 'SC-026',
    pricing: PRICING,
    nowMs: NOW_MS,
    nowIso: NOW_ISO,
    correlationId: 'corr-test',
    idFactory: () => `sess-${++n}`,
    ...overrides
  };
}

function walletData(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    userId: 'u1',
    purchasedCredits: 100,
    promotionalCredits: 0,
    promotionalExpiresAt: null,
    creditDebt: 0,
    version: 0,
    updatedAt: NOW_ISO,
    ...overrides
  };
}

function sessionData(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'active-1',
    userId: 'u1',
    toolId: 'SC-026',
    pricingTier: 'ADVANCED',
    creditCost: 15,
    status: 'ACTIVE',
    startedAt: NOW_ISO,
    expiresAt: FUTURE_ISO,
    createdAt: NOW_ISO,
    ...overrides
  };
}

function entitlementData(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'u1_SC-026',
    userId: 'u1',
    toolId: 'SC-026',
    toolSlug: 'shaft-design',
    toolName: 'Shaft Design Calculator',
    purchaseId: null,
    paddleTransactionId: null,
    status: 'ACTIVE',
    accessType: 'CREDIT_BASED',
    startsAt: NOW_ISO,
    expiresAt: FUTURE_ISO,
    usageLimit: null,
    usageConsumed: 0,
    creditsGranted: null,
    creditsConsumed: 0,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    lastUsedAt: null,
    ...overrides
  };
}

/** Fake tx that throws on any read issued after the first write. */
class FakeTx implements ProfessionalSessionTx {
  readonly order: string[] = [];
  private writeCount = 0;
  private readonly docData = new Map<unknown, Record<string, unknown>>();
  private readonly queryDocs: Array<{ ref: unknown; id: string; data: Record<string, unknown> }> =
    [];
  readonly written = new Map<unknown, unknown>();

  constructor(
    opts: {
      docs?: Array<{ ref: unknown; data: Record<string, unknown> }>;
      queryDocs?: Array<{ ref: unknown; id: string; data: Record<string, unknown> }>;
    } = {}
  ) {
    for (const d of opts.docs ?? []) this.docData.set(d.ref, d.data);
    this.queryDocs = opts.queryDocs ?? [];
  }

  private assertReadAllowed(): void {
    if (this.writeCount > 0) {
      throw new Error('FIRESTORE_READ_AFTER_WRITE');
    }
  }

  async getDoc(ref: unknown): Promise<SessionDocSnapshotLike> {
    this.assertReadAllowed();
    this.order.push(`read:${String(ref)}`);
    const data = this.docData.get(ref);
    return data ? { exists: true, data: () => data } : { exists: false, data: () => undefined };
  }

  async getQuery(ref: unknown): Promise<SessionQuerySnapshotLike> {
    this.assertReadAllowed();
    this.order.push(`readQ:${String(ref)}`);
    return {
      docs: this.queryDocs.map((d) => ({ id: d.id, ref: d.ref, data: () => d.data }))
    };
  }

  set(ref: unknown, data: unknown, opts?: { merge?: boolean }): void {
    this.writeCount += 1;
    this.order.push(`write:${String(ref)}`);
    this.written.set(ref, data);
  }

  update(ref: unknown, data: unknown): void {
    this.writeCount += 1;
    this.order.push(`update:${String(ref)}`);
  }
}

function assertNoReadAfterWrite(order: string[]): void {
  let lastWrite = -1;
  for (let i = 0; i < order.length; i++) {
    const op = order[i]!;
    if (op.startsWith('write:') || op.startsWith('update:')) lastWrite = i;
    if ((op.startsWith('read:') || op.startsWith('readQ:')) && lastWrite >= 0) {
      throw new Error(`READ_AFTER_WRITE at index ${i}: ${order.join(' -> ')}`);
    }
  }
  const firstWrite = order.findIndex((o) => o.startsWith('write:') || o.startsWith('update:'));
  const readsAfter = order.filter((o) => o.startsWith('read:') || o.startsWith('readQ:'));
  const lastRead = order.lastIndexOf(readsAfter[readsAfter.length - 1]!);
  if (firstWrite >= 0 && lastRead > firstWrite) {
    throw new Error(`read appears after first write: ${order.join(' -> ')}`);
  }
}

describe('executeProfessionalSessionTx — Firestore read-before-write', () => {
  it('1. new session: single debit, session create, entitlement create, HTTP 200', async () => {
    const tx = new FakeTx({ docs: [{ ref: 'wallet', data: walletData() }] });
    const result = await executeProfessionalSessionTx(tx, refs(), baseCtx());

    assertNoReadAfterWrite(tx.order);
    expect(result.reused).toBe(false);
    expect(result.creditCost).toBe(15);
    expect(tx.order.filter((o) => o === 'write:wallet')).toHaveLength(1);
    expect(tx.order.filter((o) => o.startsWith('write:ledger:'))).toHaveLength(1);
    expect(tx.order.filter((o) => o.startsWith('write:session:'))).toHaveLength(1);
    expect(tx.order.filter((o) => o === 'write:ent')).toHaveLength(1);
    const ledger = tx.written.get('ledger:sess-1') as { type: string; deltaCredits: number };
    expect(ledger.type).toBe('SESSION_DEBIT');
    expect(ledger.deltaCredits).toBe(-15);
    const ent = tx.written.get('ent') as { usageConsumed: number; creditsConsumed: number };
    expect(ent.usageConsumed).toBe(1);
    expect(ent.creditsConsumed).toBe(15);
    // reads happened before any write
    expect(tx.order.indexOf('read:wallet')).toBeLessThan(
      tx.order.findIndex((o) => o.startsWith('write:'))
    );
    expect(tx.order.indexOf('readQ:activeQ')).toBeLessThan(
      tx.order.findIndex((o) => o.startsWith('write:'))
    );
    expect(tx.order.indexOf('read:ent')).toBeLessThan(
      tx.order.findIndex((o) => o.startsWith('write:'))
    );
  });

  it('2. active session reuse: no second debit, reused=true', async () => {
    const tx = new FakeTx({
      docs: [
        { ref: 'wallet', data: walletData() },
        { ref: 'ent', data: entitlementData({ usageConsumed: 1, creditsConsumed: 15 }) }
      ],
      queryDocs: [{ ref: 'active-1-ref', id: 'active-1', data: sessionData() }]
    });
    const result = await executeProfessionalSessionTx(tx, refs(), baseCtx());

    assertNoReadAfterWrite(tx.order);
    expect(result.reused).toBe(true);
    expect(result.creditCost).toBe(0);
    expect(tx.order.filter((o) => o === 'write:wallet')).toHaveLength(0);
    expect(tx.order.filter((o) => o.startsWith('write:ledger:'))).toHaveLength(0);
    expect(tx.order.filter((o) => o.startsWith('write:session:'))).toHaveLength(0);
    // entitlement touched (no debit, usage refreshed)
    expect(tx.order.filter((o) => o === 'write:ent')).toHaveLength(1);
  });

  it('3. expired session: cleanup update, new session, single debit, no read-after-write', async () => {
    const tx = new FakeTx({
      docs: [{ ref: 'wallet', data: walletData() }],
      queryDocs: [
        { ref: 'expired-ref', id: 'expired-1', data: sessionData({ expiresAt: PAST_ISO }) }
      ]
    });
    const result = await executeProfessionalSessionTx(tx, refs(), baseCtx());

    assertNoReadAfterWrite(tx.order);
    expect(tx.order.filter((o) => o === 'update:expired-ref')).toHaveLength(1);
    expect(result.reused).toBe(false);
    expect(result.creditCost).toBe(15);
    const debitCount = tx.order.filter((o) => o.startsWith('write:ledger:')).length;
    expect(debitCount).toBe(1);
    const updateIdx = tx.order.indexOf('update:expired-ref');
    const writesStart = tx.order.findIndex((o) => o.startsWith('write:'));
    expect(updateIdx).toBeLessThan(writesStart === -1 ? tx.order.length : writesStart);
  });

  it('4. existing entitlement: entitlement update with correct usageConsumed', async () => {
    const tx = new FakeTx({
      docs: [
        { ref: 'wallet', data: walletData() },
        {
          ref: 'ent',
          data: entitlementData({ usageConsumed: 5, creditsConsumed: 10 })
        }
      ]
    });
    const result = await executeProfessionalSessionTx(tx, refs(), baseCtx());

    assertNoReadAfterWrite(tx.order);
    expect(result.reused).toBe(false);
    const ent = tx.written.get('ent') as {
      usageConsumed: number;
      creditsConsumed: number;
      startsAt: string;
      createdAt: string;
    };
    expect(ent.usageConsumed).toBe(6);
    expect(ent.creditsConsumed).toBe(25);
    expect(ent.startsAt).toBe(NOW_ISO); // existing startsAt preserved
    expect(ent.createdAt).toBe(NOW_ISO); // existing createdAt preserved
  });

  it('5. missing entitlement + reused session: 200, no debit, no entitlement write, no throw', async () => {
    const tx = new FakeTx({
      docs: [{ ref: 'wallet', data: walletData() }],
      queryDocs: [{ ref: 'active-1-ref', id: 'active-1', data: sessionData() }]
    });
    const result = await executeProfessionalSessionTx(tx, refs(), baseCtx());

    assertNoReadAfterWrite(tx.order);
    expect(result.reused).toBe(true);
    expect(result.creditCost).toBe(0);
    expect(tx.order.filter((o) => o === 'write:wallet')).toHaveLength(0);
    expect(tx.order.filter((o) => o.startsWith('write:ledger:'))).toHaveLength(0);
    expect(tx.order.filter((o) => o === 'write:ent')).toHaveLength(0);
  });

  it('6. insufficient credits: error payload, wallet/ledger/session/entitlement untouched', async () => {
    const tx = new FakeTx({ docs: [{ ref: 'wallet', data: walletData({ purchasedCredits: 1 }) }] });
    const result = await executeProfessionalSessionTx(tx, refs(), baseCtx());

    assertNoReadAfterWrite(tx.order);
    expect(result.error).toBe('INSUFFICIENT_CREDITS');
    expect(result.requiredCredits).toBe(15);
    expect(result.availableCredits).toBe(1);
    expect(tx.order.filter((o) => o.startsWith('write:'))).toHaveLength(0);
    expect(tx.order.filter((o) => o.startsWith('update:'))).toHaveLength(0);
  });

  it('7. sequential replay (concurrency retry): only one debit across both calls', async () => {
    // First call: creates session + debits 15 → wallet 85.
    const tx1 = new FakeTx({ docs: [{ ref: 'wallet', data: walletData() }] });
    const first = await executeProfessionalSessionTx(tx1, refs(), baseCtx());
    assertNoReadAfterWrite(tx1.order);
    expect(first.reused).toBe(false);

    // Second call simulating the committed state (transaction retry/parallel request):
    // wallet now 85, an active session exists, entitlement exists.
    const tx2 = new FakeTx({
      docs: [
        { ref: 'wallet', data: walletData({ purchasedCredits: 85 }) },
        { ref: 'ent', data: entitlementData({ usageConsumed: 1, creditsConsumed: 15 }) }
      ],
      queryDocs: [{ ref: 'active-1-ref', id: 'active-1', data: sessionData({ id: 'sess-1' }) }]
    });
    const second = await executeProfessionalSessionTx(tx2, refs(), baseCtx());
    assertNoReadAfterWrite(tx2.order);
    expect(second.reused).toBe(true);
    expect(second.creditCost).toBe(0);
    expect(tx2.order.filter((o) => o.startsWith('write:ledger:'))).toHaveLength(0);
    expect(tx2.order.filter((o) => o === 'write:wallet')).toHaveLength(0);
  });
});

/** Shared in-memory store with Firestore-style optimistic concurrency. */
class ConcurrentStore {
  docs = new Map<string, Record<string, unknown> | null>();

  constructor(entries: Array<[string, Record<string, unknown> | null]> = []) {
    for (const [k, v] of entries) this.docs.set(k, v);
  }

  clone(): ConcurrentStore {
    return new ConcurrentStore(Array.from(this.docs));
  }
}

function deepEqualDoc(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/** Fake tx bound to a snapshot; commit fails (conflict) if any read doc changed. */
class SnapshotTx implements ProfessionalSessionTx {
  private readonly snapshot: Map<string, Record<string, unknown> | null>;
  private readonly readRefs: string[] = [];
  private readonly writes: Array<{
    kind: 'set' | 'update';
    ref: string;
    data: Record<string, unknown>;
  }> = [];
  private wrote = false;

  constructor(
    private readonly store: ConcurrentStore,
    private readonly toolId: string
  ) {
    this.snapshot = store.clone().docs;
  }

  private assertReadAllowed(): void {
    if (this.wrote) throw new Error('FIRESTORE_READ_AFTER_WRITE');
  }

  async getDoc(ref: unknown): Promise<SessionDocSnapshotLike> {
    this.assertReadAllowed();
    const r = String(ref);
    this.readRefs.push(r);
    const d = this.snapshot.get(r);
    return d === null || d === undefined
      ? { exists: false, data: () => undefined }
      : { exists: true, data: () => d };
  }

  async getQuery(ref: unknown): Promise<SessionQuerySnapshotLike> {
    this.assertReadAllowed();
    const docs: Array<{ id: string; ref: unknown; data(): Record<string, unknown> }> = [];
    for (const [key, data] of this.snapshot) {
      if (!key.startsWith('session:')) continue;
      if (data?.toolId !== this.toolId || data?.status !== 'ACTIVE') continue;
      docs.push({ id: data.id as string, ref: key, data: () => data });
    }
    docs.sort((a, b) => (a.id < b.id ? -1 : 1));
    return { docs: docs.slice(0, 5) };
  }

  set(ref: unknown, data: unknown): void {
    this.wrote = true;
    this.writes.push({ kind: 'set', ref: String(ref), data: data as Record<string, unknown> });
  }

  update(ref: unknown, data: unknown): void {
    this.wrote = true;
    this.writes.push({ kind: 'update', ref: String(ref), data: data as Record<string, unknown> });
  }

  private sessionRows(
    map: Map<string, Record<string, unknown> | null>
  ): Array<Record<string, unknown>> {
    const out: Array<Record<string, unknown>> = [];
    for (const [key, data] of map) {
      if (!key.startsWith('session:') || data?.toolId !== this.toolId) continue;
      out.push({ ref: key, id: data.id, status: data.status, toolId: data.toolId });
    }
    return out.sort((a, b) => (String(a.ref) < String(b.ref) ? -1 : 1));
  }

  /** True when the committed store diverges from what this tx read. */
  conflicts(store: ConcurrentStore): boolean {
    for (const r of this.readRefs) {
      if (!deepEqualDoc(this.snapshot.get(r), store.docs.get(r))) return true;
    }
    return (
      JSON.stringify(this.sessionRows(this.snapshot)) !==
      JSON.stringify(this.sessionRows(store.docs))
    );
  }

  commit(store: ConcurrentStore): void {
    for (const w of this.writes) {
      store.docs.set(w.ref, { ...(store.docs.get(w.ref) ?? {}), ...w.data });
    }
  }
}

/** Mimics Firestore runTransaction: retry the callback when the commit conflicts. */
async function runWithRetry(
  store: ConcurrentStore,
  toolId: string,
  ctx: Parameters<typeof executeProfessionalSessionTx>[2],
  maxAttempts = 5
): Promise<Record<string, unknown>> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const tx = new SnapshotTx(store, toolId);
    const result = await executeProfessionalSessionTx(tx, refs(), ctx);
    if (!tx.conflicts(store)) {
      tx.commit(store);
      return result;
    }
  }
  throw new Error('MAX_TRANSACTION_RETRIES');
}

describe('executeProfessionalSessionTx — concurrent open (real two-request contention)', () => {
  it('7. concurrent open: one debit, one active session, loser reuses after retry', async () => {
    const store = new ConcurrentStore([['wallet', walletData()]]);

    const [first, second] = await Promise.all([
      runWithRetry(store, 'SC-026', baseCtx()),
      runWithRetry(store, 'SC-026', baseCtx())
    ]);

    // Exactly one wallet decrement.
    const wallet = store.docs.get('wallet') as { purchasedCredits: number; version: number };
    expect(wallet.purchasedCredits).toBe(85);
    expect(wallet.version).toBe(1);

    // Exactly one active session survives.
    const activeSessions = [...store.docs.keys()]
      .filter((k) => k.startsWith('session:'))
      .map((k) => store.docs.get(k) as { status: string });
    expect(activeSessions.filter((s) => s.status === 'ACTIVE')).toHaveLength(1);

    // Exactly one ledger debit.
    const ledgerEntries = [...store.docs.keys()].filter((k) => k.startsWith('ledger:'));
    expect(ledgerEntries).toHaveLength(1);

    // One caller debited a new session; the other reused the committed session.
    const newSession = [first, second].filter((r) => r.reused === false);
    const reused = [first, second].filter((r) => r.reused === true);
    expect(newSession).toHaveLength(1);
    expect(reused).toHaveLength(1);
    expect(newSession[0]!.creditCost).toBe(15);
    expect(reused[0]!.creditCost).toBe(0);
  });
});
