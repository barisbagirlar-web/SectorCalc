import { describe, expect, it } from 'vitest';
import {
  executeProfessionalSessionTx,
  type ProfessionalSessionTx,
  type ProfessionalSessionTxRefs,
  type SessionDocSnapshotLike,
  type SessionQuerySnapshotLike
} from '../functions/src/http/session';

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
