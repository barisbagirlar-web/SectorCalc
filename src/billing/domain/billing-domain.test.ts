import { describe, it, expect } from 'vitest';
import {
  CREDIT_PACKAGES,
  INVALID_PADDLE_PRICE_IDS,
  assertNoInvalidPriceMapping,
  resolveToolCost
} from './packages.js';
import { applyPurchaseGrant, applyPurchaseReversal } from './grant.js';
import { openProfessionalSession } from './session.js';
import { emptyWallet } from './types.js';
import { sanitizeReturnTo } from './return-to.js';

let n = 0;
const idFactory = () => `id_${++n}`;

describe('packages SSOT', () => {
  it('defines mandate packs', () => {
    expect(CREDIT_PACKAGES.STARTER.credits).toBe(20);
    expect(CREDIT_PACKAGES.WORKSHOP.credits).toBe(100);
    expect(CREDIT_PACKAGES.PROFESSIONAL.credits).toBe(300);
    expect(CREDIT_PACKAGES.TEAM_WALLET.credits).toBe(1000);
    expect(CREDIT_PACKAGES.STARTER.expectedMinorUnits).toBe('1500');
  });

  it('requires all four price IDs', () => {
    const errs = assertNoInvalidPriceMapping({
      STARTER: '',
      WORKSHOP: 'pri_ok_workshop',
      PROFESSIONAL: 'pri_ok_pro',
      TEAM_WALLET: 'pri_ok_team'
    });
    expect(errs.some((e) => e.includes('missing'))).toBe(true);
  });

  it('accepts configured sandbox one-time IDs when present', () => {
    const errs = assertNoInvalidPriceMapping({
      STARTER: 'pri_01kyhfb5q0jxrck07py0xxaqw7',
      WORKSHOP: 'pri_01kyhfczs0aaj62smrthvc3my8',
      PROFESSIONAL: 'pri_01kyhff4xx34m229w6ytpjpefs',
      TEAM_WALLET: 'pri_01kyhfgk3ax50gz1m7zh877w9c'
    });
    expect(errs).toEqual([]);
    expect(INVALID_PADDLE_PRICE_IDS).toEqual([]);
  });

  it('five SEO-bait tools are free; Tier-A revenue tools stay credit-gated', () => {
    const freeIds = ['SC-001', 'SC-027', 'SC-028', 'SC-030', 'SC-039'] as const;
    const paidIds = [
      'SC-008',
      'SC-010',
      'SC-012',
      'SC-020',
      'SC-021',
      'SC-022',
      'SC-023',
      'SC-024',
      'SC-025',
      'SC-026',
      'SC-029',
      'SC-031',
      'SC-032',
      'SC-033',
      'SC-034',
      'SC-035',
      'SC-036',
      'SC-037',
      'SC-038',
      'SC-040'
    ] as const;

    for (const id of freeIds) {
      const row = resolveToolCost(id);
      expect(row, id).toBeTruthy();
      expect(row!.tier, id).toBe('FREE');
      expect(row!.monetizationEnabled, id).toBe(false);
      expect(row!.creditCost, id).toBe(0);
    }
    for (const id of paidIds) {
      const row = resolveToolCost(id);
      expect(row, id).toBeTruthy();
      expect(row!.monetizationEnabled, id).toBe(true);
      expect(row!.creditCost, id).toBeGreaterThan(0);
    }
    expect(resolveToolCost('SC-020')).toEqual({
      tier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true
    });
    expect(resolveToolCost('SC-008')?.creditCost).toBe(15);
    expect(resolveToolCost('SC-021')?.creditCost).toBe(7);
    // Rubric rebalance (decision stakes × engine depth × cost-of-wrong)
    expect(resolveToolCost('SC-012')).toEqual({
      tier: 'PRO',
      creditCost: 7,
      monetizationEnabled: true
    });
    expect(resolveToolCost('SC-023')?.creditCost).toBe(3);
    expect(resolveToolCost('SC-024')?.creditCost).toBe(3);
    expect(resolveToolCost('SC-026')?.creditCost).toBe(15);
    expect(resolveToolCost('SC-031')?.creditCost).toBe(15);
    expect(resolveToolCost('SC-032')?.creditCost).toBe(15);
  });
});

describe('applyPurchaseGrant', () => {
  it('grants purchased credits', () => {
    const now = '2026-07-27T12:00:00.000Z';
    const { wallet, ledger } = applyPurchaseGrant({
      wallet: emptyWallet('u1', now),
      grantCredits: 100,
      sourceId: 'txn_1',
      nowIso: now,
      idFactory
    });
    expect(wallet.purchasedCredits).toBe(100);
    expect(ledger.filter((l) => l.type === 'PURCHASE_GRANT')).toHaveLength(1);
  });

  it('settles debt before granting remainder', () => {
    const now = '2026-07-27T12:00:00.000Z';
    const base = { ...emptyWallet('u1', now), creditDebt: 30 };
    const { wallet, ledger } = applyPurchaseGrant({
      wallet: base,
      grantCredits: 100,
      sourceId: 'txn_2',
      nowIso: now,
      idFactory
    });
    expect(wallet.creditDebt).toBe(0);
    expect(wallet.purchasedCredits).toBe(70);
    expect(ledger.some((l) => l.type === 'DEBT_SETTLED')).toBe(true);
  });
});

describe('applyPurchaseReversal', () => {
  it('full unused refund clears purchased', () => {
    const now = '2026-07-27T12:00:00.000Z';
    const base = { ...emptyWallet('u1', now), purchasedCredits: 100 };
    const { wallet } = applyPurchaseReversal({
      wallet: base,
      reverseCredits: 100,
      sourceId: 'adj_1',
      nowIso: now,
      idFactory,
      kind: 'REFUND_REVERSAL'
    });
    expect(wallet.purchasedCredits).toBe(0);
    expect(wallet.creditDebt).toBe(0);
  });

  it('spent refund creates debt', () => {
    const now = '2026-07-27T12:00:00.000Z';
    const base = { ...emptyWallet('u1', now), purchasedCredits: 85 };
    const { wallet } = applyPurchaseReversal({
      wallet: base,
      reverseCredits: 100,
      sourceId: 'adj_2',
      nowIso: now,
      idFactory,
      kind: 'REFUND_REVERSAL'
    });
    expect(wallet.purchasedCredits).toBe(0);
    expect(wallet.creditDebt).toBe(15);
  });
});

describe('openProfessionalSession concurrency semantics', () => {
  it('debits 15 once then reuses', () => {
    const now = Date.parse('2026-07-27T12:00:00.000Z');
    const base = { ...emptyWallet('u1', new Date(now).toISOString()), purchasedCredits: 100 };
    const first = openProfessionalSession({
      wallet: base,
      userId: 'u1',
      toolId: 'SC-020',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: now,
      idFactory
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.debit).toBe(15);
    expect(first.wallet.purchasedCredits).toBe(85);

    const second = openProfessionalSession({
      wallet: first.wallet,
      userId: 'u1',
      toolId: 'SC-020',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: first.session,
      nowMs: now + 1000,
      idFactory
    });
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.reused).toBe(true);
    expect(second.debit).toBe(0);
    expect(second.wallet.purchasedCredits).toBe(85);
  });

  it('promo spends before purchased', () => {
    const now = Date.parse('2026-07-27T12:00:00.000Z');
    const base = {
      ...emptyWallet('u1', new Date(now).toISOString()),
      purchasedCredits: 20,
      promotionalCredits: 5,
      promotionalExpiresAt: new Date(now + 86400000).toISOString()
    };
    const res = openProfessionalSession({
      wallet: base,
      userId: 'u1',
      toolId: 'SC-020',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: now,
      idFactory
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.wallet.promotionalCredits).toBe(0);
    expect(res.wallet.purchasedCredits).toBe(10);
  });

  it('blocks on debt', () => {
    const now = Date.now();
    const base = {
      ...emptyWallet('u1', new Date(now).toISOString()),
      purchasedCredits: 100,
      creditDebt: 1
    };
    const res = openProfessionalSession({
      wallet: base,
      userId: 'u1',
      toolId: 'SC-020',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: now,
      idFactory
    });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.code).toBe('BILLING_DEBT');
  });
});

describe('sanitizeReturnTo', () => {
  it('allows relative same-origin paths only', () => {
    expect(sanitizeReturnTo('/calculator/cnc-machining-cost', [])).toBe(
      '/calculator/cnc-machining-cost'
    );
    expect(sanitizeReturnTo('https://evil.com', ['https://sectorcalc.com'])).toBe(null);
    expect(sanitizeReturnTo('//evil.com', [])).toBe(null);
  });
});

describe('webhook replay grant uniqueness (domain)', () => {
  it('applying grant twice would double — callers must gate; single apply is +100', () => {
    const now = '2026-07-27T12:00:00.000Z';
    const once = applyPurchaseGrant({
      wallet: emptyWallet('u1', now),
      grantCredits: 100,
      sourceId: 'txn_replay',
      nowIso: now,
      idFactory
    });
    expect(once.wallet.purchasedCredits).toBe(100);
    // Domain is pure; idempotency is persistence-layer. Document expected final.
    expect(once.ledger.filter((l) => l.type === 'PURCHASE_GRANT').length).toBe(1);
  });
});
