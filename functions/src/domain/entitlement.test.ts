import { describe, expect, it } from 'vitest';
import {
  buildEntitlementId,
  computeEntitlementStatus,
  creditSessionDecision,
  entitlementCanAccess,
  entitlementDaysRemaining,
  sessionRemainingLabel,
  sessionRemainingSeconds,
  touchEntitlementUsage,
  upsertCreditBasedEntitlement,
  type ToolEntitlement
} from './entitlement';

const NOW = Date.parse('2026-07-31T12:00:00Z');
const HOUR = 3_600_000;
const DAY = 86_400_000;

function baseEntitlement(): ToolEntitlement {
  return {
    id: 'uid_SC-029',
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
    lastUsedAt: new Date(NOW).toISOString()
  };
}

describe('buildEntitlementId', () => {
  it('is deterministic per user+tool', () => {
    expect(buildEntitlementId('u1', 'SC-029')).toBe('u1_SC-029');
    expect(buildEntitlementId('u1', 'SC-029')).toBe(buildEntitlementId('u1', 'SC-029'));
    expect(buildEntitlementId('u1', 'SC-029')).not.toBe(buildEntitlementId('u2', 'SC-029'));
  });
});

describe('entitlementDaysRemaining', () => {
  it('returns null without expiresAt', () => {
    expect(entitlementDaysRemaining(null, NOW)).toBeNull();
  });
  it('rounds up to whole days', () => {
    expect(entitlementDaysRemaining(new Date(NOW + 36 * HOUR).toISOString(), NOW)).toBe(2);
    expect(entitlementDaysRemaining(new Date(NOW + DAY).toISOString(), NOW)).toBe(1);
  });
  it('is <= 0 at/after expiry', () => {
    expect(entitlementDaysRemaining(new Date(NOW).toISOString(), NOW)).toBe(0);
    expect(entitlementDaysRemaining(new Date(NOW - DAY).toISOString(), NOW)).toBe(-1);
  });
});

describe('computeEntitlementStatus', () => {
  it('honors SUSPENDED', () => {
    expect(
      computeEntitlementStatus({
        storedStatus: 'SUSPENDED',
        accessType: 'CREDIT_BASED',
        expiresAt: new Date(NOW + DAY).toISOString(),
        usageLimit: null,
        usageConsumed: 0,
        nowMs: NOW
      })
    ).toBe('SUSPENDED');
  });

  it('LIFETIME is always ACTIVE', () => {
    expect(
      computeEntitlementStatus({
        storedStatus: 'ACTIVE',
        accessType: 'LIFETIME',
        expiresAt: null,
        usageLimit: null,
        usageConsumed: 0,
        nowMs: NOW
      })
    ).toBe('ACTIVE');
  });

  it('CREDIT_BASED is ACTIVE inside window, EXPIRED outside', () => {
    const live = computeEntitlementStatus({
      storedStatus: 'ACTIVE',
      accessType: 'CREDIT_BASED',
      expiresAt: new Date(NOW + DAY).toISOString(),
      usageLimit: null,
      usageConsumed: 0,
      nowMs: NOW
    });
    expect(live).toBe('ACTIVE');

    const gone = computeEntitlementStatus({
      storedStatus: 'ACTIVE',
      accessType: 'CREDIT_BASED',
      expiresAt: new Date(NOW - 1000).toISOString(),
      usageLimit: null,
      usageConsumed: 0,
      nowMs: NOW
    });
    expect(gone).toBe('EXPIRED');
  });

  it('FIXED_TERM is EXPIRING within 30 days, EXPIRED after end', () => {
    const expiring = computeEntitlementStatus({
      storedStatus: 'ACTIVE',
      accessType: 'FIXED_TERM',
      expiresAt: new Date(NOW + 27 * DAY).toISOString(),
      usageLimit: null,
      usageConsumed: 0,
      nowMs: NOW
    });
    expect(expiring).toBe('EXPIRING');

    const ended = computeEntitlementStatus({
      storedStatus: 'ACTIVE',
      accessType: 'FIXED_TERM',
      expiresAt: new Date(NOW - 1000).toISOString(),
      usageLimit: null,
      usageConsumed: 0,
      nowMs: NOW
    });
    expect(ended).toBe('EXPIRED');
  });

  it('USAGE_LIMIT exhausted → EXPIRED', () => {
    expect(
      computeEntitlementStatus({
        storedStatus: 'ACTIVE',
        accessType: 'USAGE_LIMIT',
        expiresAt: null,
        usageLimit: 20,
        usageConsumed: 20,
        nowMs: NOW
      })
    ).toBe('EXPIRED');
  });
});

describe('entitlementCanAccess', () => {
  it('false when SUSPENDED or EXPIRED', () => {
    expect(
      entitlementCanAccess({
        status: 'SUSPENDED',
        accessType: 'CREDIT_BASED',
        expiresAt: new Date(NOW + DAY).toISOString(),
        usageLimit: null,
        usageConsumed: 0,
        creditsAvailable: 100,
        creditCost: 15,
        nowMs: NOW
      })
    ).toBe(false);
    expect(
      entitlementCanAccess({
        status: 'EXPIRED',
        accessType: 'CREDIT_BASED',
        expiresAt: new Date(NOW - 1000).toISOString(),
        usageLimit: null,
        usageConsumed: 0,
        creditsAvailable: 100,
        creditCost: 15,
        nowMs: NOW
      })
    ).toBe(false);
  });

  it('CREDIT_BASED: true with live session OR enough credits', () => {
    const viaSession = entitlementCanAccess({
      status: 'ACTIVE',
      accessType: 'CREDIT_BASED',
      expiresAt: new Date(NOW + DAY).toISOString(),
      usageLimit: null,
      usageConsumed: 1,
      creditsAvailable: 0,
      creditCost: 15,
      nowMs: NOW
    });
    expect(viaSession).toBe(true);

    const viaCredits = entitlementCanAccess({
      status: 'ACTIVE',
      accessType: 'CREDIT_BASED',
      expiresAt: null,
      usageLimit: null,
      usageConsumed: 0,
      creditsAvailable: 20,
      creditCost: 15,
      nowMs: NOW
    });
    expect(viaCredits).toBe(true);

    const neither = entitlementCanAccess({
      status: 'ACTIVE',
      accessType: 'CREDIT_BASED',
      expiresAt: null,
      usageLimit: null,
      usageConsumed: 0,
      creditsAvailable: 5,
      creditCost: 15,
      nowMs: NOW
    });
    expect(neither).toBe(false);
  });

  it('USAGE_LIMIT false when remaining is zero', () => {
    expect(
      entitlementCanAccess({
        status: 'EXPIRED',
        accessType: 'USAGE_LIMIT',
        expiresAt: null,
        usageLimit: 20,
        usageConsumed: 20,
        creditsAvailable: 0,
        creditCost: 0,
        nowMs: NOW
      })
    ).toBe(false);
  });
});

describe('upsertCreditBasedEntitlement', () => {
  it('creates a fresh record on first open', () => {
    const ent = upsertCreditBasedEntitlement({
      existing: null,
      userId: 'uid',
      toolId: 'SC-029',
      purchaseId: 'session:SC-029:1',
      expiresAt: new Date(NOW + DAY).toISOString(),
      debit: 15,
      nowIso: new Date(NOW).toISOString()
    });
    expect(ent.id).toBe('uid_SC-029');
    expect(ent.accessType).toBe('CREDIT_BASED');
    expect(ent.status).toBe('ACTIVE');
    expect(ent.usageConsumed).toBe(1);
    expect(ent.creditsConsumed).toBe(15);
    expect(ent.toolName).toContain('Heat Input');
    expect(ent.startsAt).toBe(ent.createdAt);
  });

  it('extends an existing record idempotently (no duplicate id)', () => {
    const existing = baseEntitlement();
    const next = upsertCreditBasedEntitlement({
      existing,
      userId: 'uid',
      toolId: 'SC-029',
      purchaseId: 'session:SC-029:2',
      expiresAt: new Date(NOW + DAY).toISOString(),
      debit: 15,
      nowIso: new Date(NOW + 5 * 60_000).toISOString()
    });
    expect(next.id).toBe(existing.id);
    expect(next.usageConsumed).toBe(2);
    expect(next.creditsConsumed).toBe(30);
    expect(next.startsAt).toBe(existing.startsAt);
    expect(next.createdAt).toBe(existing.createdAt);
  });
});

describe('touchEntitlementUsage', () => {
  it('refreshes lastUsedAt without changing counters', () => {
    const existing = baseEntitlement();
    const touched = touchEntitlementUsage({
      existing,
      nowIso: new Date(NOW + HOUR).toISOString()
    });
    expect(touched.usageConsumed).toBe(1);
    expect(touched.creditsConsumed).toBe(15);
    expect(touched.lastUsedAt).toBe(new Date(NOW + HOUR).toISOString());
  });
});

describe('creditSessionDecision', () => {
  it('live session → canOpenWithoutDebit=true, no new session flag', () => {
    const d = creditSessionDecision({
      hasLiveSession: true,
      sessionEndsAt: new Date(NOW + 18 * HOUR).toISOString(),
      creditsAvailable: 0,
      creditCost: 15
    });
    expect(d.sessionStatus).toBe('ACTIVE');
    expect(d.canOpenWithoutDebit).toBe(true);
    expect(d.canStartNewSession).toBe(false);
  });

  it('no session + enough credits → canStartNewSession=true', () => {
    const d = creditSessionDecision({
      hasLiveSession: false,
      sessionEndsAt: null,
      creditsAvailable: 85,
      creditCost: 15
    });
    expect(d.sessionStatus).toBe('ENDED');
    expect(d.canOpenWithoutDebit).toBe(false);
    expect(d.canStartNewSession).toBe(true);
  });

  it('no session + insufficient credits → both false (entitlement alone grants nothing)', () => {
    const d = creditSessionDecision({
      hasLiveSession: false,
      sessionEndsAt: null,
      creditsAvailable: 5,
      creditCost: 15
    });
    expect(d.sessionStatus).toBe('ENDED');
    expect(d.canOpenWithoutDebit).toBe(false);
    expect(d.canStartNewSession).toBe(false);
  });

  it('zero credits → cannot start even when cost is zero', () => {
    const d = creditSessionDecision({
      hasLiveSession: false,
      sessionEndsAt: null,
      creditsAvailable: 0,
      creditCost: 0
    });
    expect(d.canOpenWithoutDebit).toBe(false);
    expect(d.canStartNewSession).toBe(false);
  });

  it('exact expiry boundary is ENDED (server-time comparison)', () => {
    const d = creditSessionDecision({
      hasLiveSession: false,
      sessionEndsAt: new Date(NOW).toISOString(),
      creditsAvailable: 15,
      creditCost: 15
    });
    expect(d.sessionStatus).toBe('ENDED');
    expect(d.canStartNewSession).toBe(true);
  });
});

describe('sessionRemainingSeconds / sessionRemainingLabel', () => {
  it('computes whole seconds from server time', () => {
    expect(
      sessionRemainingSeconds(new Date(NOW + 18 * HOUR + 42 * 60_000).toISOString(), NOW)
    ).toBe(18 * 3600 + 42 * 60);
    expect(sessionRemainingSeconds(null, NOW)).toBe(0);
    expect(sessionRemainingSeconds(new Date(NOW - 1000).toISOString(), NOW)).toBe(0);
  });

  it('formats human labels server-side', () => {
    expect(sessionRemainingLabel(new Date(NOW + 18 * HOUR + 42 * 60_000).toISOString(), NOW)).toBe(
      '18h 42m'
    );
    expect(sessionRemainingLabel(new Date(NOW + 26 * HOUR).toISOString(), NOW)).toBe('1d 2h');
    expect(sessionRemainingLabel(new Date(NOW + 5 * 60_000).toISOString(), NOW)).toBe('5m');
    expect(sessionRemainingLabel(null, NOW)).toBe('ended');
  });
});
