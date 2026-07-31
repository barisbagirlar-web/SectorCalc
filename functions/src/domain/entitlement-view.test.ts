import { describe, expect, it } from 'vitest';
import {
  buildMergedToolViews,
  findLiveSessionForUser,
  toView,
  type EntitlementView
} from './entitlement-view';
import { buildEntitlementId, type ToolEntitlement } from './entitlement';

const NOW = Date.parse('2026-07-31T12:00:00Z');
const HOUR = 3_600_000;
const DAY = 86_400_000;

function entitlement(over: Partial<ToolEntitlement> = {}): ToolEntitlement {
  return {
    id: buildEntitlementId('uid', 'SC-029'),
    userId: 'uid',
    toolId: 'SC-029',
    toolSlug: 'weld-heat-input',
    toolName: 'Heat Input & Cooling Rate Calculator',
    purchaseId: 'session:SC-029:1785506788924',
    paddleTransactionId: null,
    status: 'ACTIVE',
    accessType: 'CREDIT_BASED',
    startsAt: new Date(NOW - DAY).toISOString(),
    expiresAt: new Date(NOW + DAY).toISOString(),
    usageLimit: null,
    usageConsumed: 1,
    creditsGranted: null,
    creditsConsumed: 15,
    createdAt: new Date(NOW - DAY).toISOString(),
    updatedAt: new Date(NOW).toISOString(),
    lastUsedAt: new Date(NOW - HOUR).toISOString(),
    ...over
  };
}

function session(
  over: Partial<{ id: string; toolId: string; startedAt: string; expiresAt: string }> = {}
) {
  return {
    id: 's1',
    toolId: 'SC-029',
    startedAt: new Date(NOW - HOUR).toISOString(),
    expiresAt: new Date(NOW + DAY).toISOString(),
    ...over
  };
}

describe('toView — CREDIT_BASED access decision', () => {
  it('live session alone opens without debit, even with zero credits', () => {
    const v = toView({
      userId: 'uid',
      toolId: 'SC-029',
      entitlement: entitlement(),
      session: session(),
      spendable: 0,
      nowMs: NOW
    });
    expect(v.sessionStatus).toBe('ACTIVE');
    expect(v.canOpenWithoutDebit).toBe(true);
    expect(v.canStartNewSession).toBe(false);
    expect(v.sessionRemainingSeconds).toBe(DAY / 1000);
  });

  it('ended session + enough credits → canStartNewSession', () => {
    const v = toView({
      userId: 'uid',
      toolId: 'SC-029',
      entitlement: entitlement({ expiresAt: new Date(NOW - 1000).toISOString() }),
      session: null,
      spendable: 85,
      nowMs: NOW
    });
    expect(v.sessionStatus).toBe('ENDED');
    expect(v.canOpenWithoutDebit).toBe(false);
    expect(v.canStartNewSession).toBe(true);
  });

  it('stored entitlement with stale expiresAt NEVER grants access alone', () => {
    const v = toView({
      userId: 'uid',
      toolId: 'SC-029',
      entitlement: entitlement({ expiresAt: new Date(NOW + DAY).toISOString() }),
      session: null, // no real live session
      spendable: 5,
      nowMs: NOW
    });
    // The record still holds a future expiresAt, but without a live session
    // and without enough credits neither decision flag may be true.
    expect(v.sessionStatus).toBe('ENDED');
    expect(v.canOpenWithoutDebit).toBe(false);
    expect(v.canStartNewSession).toBe(false);
  });

  it('insufficient credits → ended, cannot start', () => {
    const v = toView({
      userId: 'uid',
      toolId: 'SC-029',
      entitlement: entitlement(),
      session: null,
      spendable: 5,
      nowMs: NOW
    });
    expect(v.canOpenWithoutDebit).toBe(false);
    expect(v.canStartNewSession).toBe(false);
    expect(v.sessionCreditCost).toBe(15);
  });

  it('suspended record blocks both open and start', () => {
    const v = toView({
      userId: 'uid',
      toolId: 'SC-029',
      entitlement: entitlement({ status: 'SUSPENDED' }),
      session: session(),
      spendable: 100,
      nowMs: NOW
    });
    expect(v.status).toBe('SUSPENDED');
    expect(v.canOpenWithoutDebit).toBe(false);
    expect(v.canStartNewSession).toBe(false);
  });
});

describe('findLiveSessionForUser', () => {
  it('returns the newest live session for the tool only', () => {
    const docs = [
      session({ id: 'old', toolId: 'SC-029', expiresAt: new Date(NOW + HOUR).toISOString() }),
      session({ id: 'new', toolId: 'SC-029', expiresAt: new Date(NOW + 2 * HOUR).toISOString() }),
      session({ id: 'other', toolId: 'SC-010', expiresAt: new Date(NOW + DAY).toISOString() })
    ];
    const found = findLiveSessionForUser(docs, 'SC-029', NOW);
    expect(found?.id).toBe('new');
  });

  it('returns null when every session expired (exact boundary excluded)', () => {
    const found = findLiveSessionForUser(
      [session({ expiresAt: new Date(NOW).toISOString() })],
      'SC-029',
      NOW
    );
    expect(found).toBeNull();
  });
});

describe('buildMergedToolViews — /my/tools consistency', () => {
  it('a toolId appears exactly once when entitlement + live session overlap', () => {
    const res = buildMergedToolViews({
      entitlements: new Map([['SC-029', entitlement()]]),
      sessions: [session()],
      spendable: 85,
      nowMs: NOW
    });
    expect(res.rows).toHaveLength(1);
    expect(res.rows[0]!.toolId).toBe('SC-029');
  });

  it('legacy live session (no entitlement) still surfaces as ACTIVE', () => {
    const res = buildMergedToolViews({
      entitlements: new Map(),
      sessions: [session()],
      spendable: 85,
      nowMs: NOW
    });
    expect(res.rows).toHaveLength(1);
    expect(res.rows[0]!.sessionStatus).toBe('ACTIVE');
    expect(res.rows[0]!.canOpenWithoutDebit).toBe(true);
  });

  it('ended session can never surface as ACTIVE', () => {
    const res = buildMergedToolViews({
      entitlements: new Map(),
      sessions: [session({ expiresAt: new Date(NOW - 1000).toISOString() })],
      spendable: 85,
      nowMs: NOW
    });
    expect(res.rows).toHaveLength(0); // no live window → no row
  });

  it('lastUsedAt uses the maximum of entitlement and session sources', () => {
    const e = entitlement({ lastUsedAt: new Date(NOW - DAY).toISOString() });
    const res = buildMergedToolViews({
      entitlements: new Map([['SC-029', e]]),
      sessions: [session({ startedAt: new Date(NOW - HOUR).toISOString() })],
      spendable: 85,
      nowMs: NOW
    });
    expect(res.lastUsedByTool.get('SC-029')).toBe(new Date(NOW - HOUR).toISOString());
    expect(res.rows[0]!.lastUsedAt).toBe(new Date(NOW - HOUR).toISOString());
  });

  it('sorts most recently used first', () => {
    const older = entitlement({
      ...entitlement(),
      toolId: 'SC-010',
      id: buildEntitlementId('uid', 'SC-010'),
      lastUsedAt: new Date(NOW - 3 * DAY).toISOString()
    });
    const res = buildMergedToolViews({
      entitlements: new Map([
        ['SC-029', entitlement()],
        ['SC-010', older]
      ]),
      sessions: [],
      spendable: 85,
      nowMs: NOW
    });
    expect(res.rows.map((r) => r.toolId)).toEqual(['SC-029', 'SC-010']);
  });

  it('spendable credits flow into every view (single wallet source)', () => {
    const res = buildMergedToolViews({
      entitlements: new Map([['SC-029', entitlement()]]),
      sessions: [],
      spendable: 42,
      nowMs: NOW
    });
    expect(res.rows[0]!.creditsAvailable).toBe(42);
  });
});
