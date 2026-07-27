import { describe, it, expect } from 'vitest';
import { CREDIT_COST, creditCostForTier } from './pricing-tiers.js';
import {
  getToolPricingTier,
  resolveToolCreditCost,
  isToolClassified
} from './tool-pricing.js';
import {
  PACKAGES,
  PADDLE_SANDBOX_PRICE_IDS,
  getPackageByPriceId,
  getPackageByCredits,
  PURCHASED_CREDITS_EXPIRE,
  TRIAL_PROMOTIONAL_CREDITS,
  TRIAL_EXPIRY_DAYS
} from './credit-packages.js';
import {
  emptyWallet,
  applyPurchase,
  applyPromotionalGrant,
  applySessionDebit,
  availableCredits,
  toBalances,
  purchaseIdempotencyKey,
  trialGrantId
} from './ledger.js';
import {
  createActiveSession,
  findReusableSession,
  isSessionActive,
  registerReportRevision,
  professionalSessionDebitKey,
  MAX_REPORT_REVISIONS
} from './session.js';
import { isToolMonetizationActive, getMonetizationFlags } from './flags.js';

describe('pricing SSOT', () => {
  it('maps tiers to mandated costs', () => {
    expect(CREDIT_COST.FREE).toBe(0);
    expect(CREDIT_COST.CORE).toBe(3);
    expect(CREDIT_COST.PRO).toBe(7);
    expect(CREDIT_COST.ADVANCED).toBe(15);
    expect(CREDIT_COST.DECISION).toBe(30);
    expect(creditCostForTier('ADVANCED')).toBe(15);
  });

  it('classifies pilot and sample tools', () => {
    expect(getToolPricingTier('SC-008')).toBe('ADVANCED');
    expect(resolveToolCreditCost('SC-008')).toBe(15);
    expect(getToolPricingTier('SC-020')).toBe('ADVANCED');
    expect(getToolPricingTier('SC-001')).toBe('CORE');
    expect(getToolPricingTier('SC-021')).toBe('PRO');
  });

  it('leaves unclassified tools free/unmapped', () => {
    expect(isToolClassified('SC-999')).toBe(false);
    expect(resolveToolCreditCost('SC-999')).toBeNull();
  });

  it('has four credit packages with test Paddle price ids', () => {
    expect(PACKAGES.length).toBe(4);
    expect(PACKAGES.map((p) => p.credits)).toEqual([20, 100, 300, 1000]);
    expect(getPackageByCredits(20)?.price).toBe('$15');
    expect(getPackageByCredits(100)?.badge).toBe('MOST POPULAR');
    expect(getPackageByCredits(300)?.badge).toBe('BEST VALUE');
    expect(getPackageByPriceId(PADDLE_SANDBOX_PRICE_IDS.workshop)?.id).toBe('WORKSHOP');
    expect(PURCHASED_CREDITS_EXPIRE).toBe(false);
    expect(TRIAL_PROMOTIONAL_CREDITS).toBe(15);
    expect(TRIAL_EXPIRY_DAYS).toBe(14);
  });
});

describe('purchase ledger', () => {
  it('grants exactly +20 for starter purchase', () => {
    let w = emptyWallet();
    w = applyPurchase(w, {
      idempotencyKey: purchaseIdempotencyKey('evt_20'),
      credits: 20,
      packageId: 'STARTER',
      providerEventId: 'evt_20'
    });
    expect(w.purchasedCredits).toBe(20);
    expect(availableCredits(w)).toBe(20);
  });

  it('webhook replay stays exactly +20', () => {
    let w = emptyWallet();
    const input = {
      idempotencyKey: purchaseIdempotencyKey('evt_replay'),
      credits: 20,
      packageId: 'STARTER' as const,
      providerEventId: 'evt_replay'
    };
    w = applyPurchase(w, input);
    w = applyPurchase(w, input);
    w = applyPurchase(w, input);
    expect(w.purchasedCredits).toBe(20);
    expect(w.entries.filter((e) => e.type === 'PURCHASE').length).toBe(1);
  });
});

describe('professional session debit', () => {
  const now = new Date('2026-07-27T12:00:00.000Z');

  it('first ADVANCED unlock debits 15; reuse / refresh / parallel key debit 0 extra', () => {
    let w = emptyWallet(now);
    w = applyPurchase(w, {
      idempotencyKey: purchaseIdempotencyKey('buy'),
      credits: 100,
      packageId: 'WORKSHOP',
      providerEventId: 'buy',
      now
    });
    const debitKey = professionalSessionDebitKey('u1', 'SC-008', 'ses_abc');
    w = applySessionDebit(w, {
      idempotencyKey: debitKey,
      creditCost: 15,
      toolId: 'SC-008',
      pricingTier: 'ADVANCED',
      calculationSessionId: 'cs1',
      now
    });
    expect(availableCredits(w, now)).toBe(85);

    // refresh / parallel duplicate same debit key
    w = applySessionDebit(w, {
      idempotencyKey: debitKey,
      creditCost: 15,
      toolId: 'SC-008',
      pricingTier: 'ADVANCED',
      calculationSessionId: 'cs1',
      now
    });
    expect(availableCredits(w, now)).toBe(85);
  });

  it('rejects insufficient balance and never goes negative', () => {
    let w = emptyWallet(now);
    w = applyPurchase(w, {
      idempotencyKey: purchaseIdempotencyKey('small'),
      credits: 14,
      packageId: 'STARTER',
      providerEventId: 'small',
      now
    });
    expect(() =>
      applySessionDebit(w, {
        idempotencyKey: 'd1',
        creditCost: 15,
        toolId: 'SC-008',
        pricingTier: 'ADVANCED',
        calculationSessionId: 'cs',
        now
      })
    ).toThrow(/INSUFFICIENT_CREDITS/);
    expect(availableCredits(w, now)).toBe(14);

    w = applyPurchase(w, {
      idempotencyKey: purchaseIdempotencyKey('one_more'),
      credits: 1,
      packageId: 'STARTER',
      providerEventId: 'one_more',
      now
    });
    w = applySessionDebit(w, {
      idempotencyKey: 'd2',
      creditCost: 15,
      toolId: 'SC-008',
      pricingTier: 'ADVANCED',
      calculationSessionId: 'cs2',
      now
    });
    expect(availableCredits(w, now)).toBe(0);
  });

  it('consumes promotional credits before purchased', () => {
    let w = emptyWallet(now);
    w = applyPromotionalGrant(w, {
      idempotencyKey: trialGrantId('u1'),
      credits: 5,
      expiresAt: '2026-08-10T00:00:00.000Z',
      now
    });
    w = applyPurchase(w, {
      idempotencyKey: purchaseIdempotencyKey('p20'),
      credits: 20,
      packageId: 'STARTER',
      providerEventId: 'p20',
      now
    });
    w = applySessionDebit(w, {
      idempotencyKey: 'debit_adv',
      creditCost: 15,
      toolId: 'SC-020',
      pricingTier: 'ADVANCED',
      calculationSessionId: 'cs',
      now
    });
    const bal = toBalances(w, now);
    expect(bal.promotionalCredits).toBe(0);
    expect(bal.purchasedCredits).toBe(10);
  });

  it('ignores expired promo; purchased remains', () => {
    const t0 = new Date('2026-07-01T00:00:00.000Z');
    let w = emptyWallet(t0);
    w = applyPromotionalGrant(w, {
      idempotencyKey: 'promo1',
      credits: 15,
      expiresAt: '2026-07-10T00:00:00.000Z',
      now: t0
    });
    w = applyPurchase(w, {
      idempotencyKey: purchaseIdempotencyKey('keep'),
      credits: 20,
      packageId: 'STARTER',
      providerEventId: 'keep',
      now: t0
    });
    const later = new Date('2026-07-20T00:00:00.000Z');
    expect(availableCredits(w, later)).toBe(20);
    expect(() =>
      applySessionDebit(w, {
        idempotencyKey: 'need15',
        creditCost: 15,
        toolId: 'SC-008',
        pricingTier: 'ADVANCED',
        calculationSessionId: 'cs',
        now: later
      })
    ).not.toThrow();
  });
});

describe('client cost manipulation', () => {
  it('server resolves ADVANCED=15 even if client claims CORE', () => {
    const clientClaimed = 3; // CORE — must be ignored
    const serverCost = resolveToolCreditCost('SC-008');
    expect(serverCost).toBe(15);
    expect(serverCost).not.toBe(clientClaimed);
  });
});

describe('session entitlement', () => {
  it('reuses active session without new debit metadata', () => {
    const now = new Date('2026-07-27T12:00:00.000Z');
    const session = createActiveSession({
      accountId: 'u1',
      toolId: 'SC-008',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      debitTransactionId: 'debit1',
      now
    });
    expect(isSessionActive(session, now)).toBe(true);
    const found = findReusableSession([session], 'u1', 'SC-008', now);
    expect(found?.calculationSessionId).toBe(session.calculationSessionId);
    const revised = registerReportRevision(session, now);
    expect(revised.reportRevisionCount).toBe(1);
    expect(MAX_REPORT_REVISIONS).toBe(3);
  });
});

describe('feature flags', () => {
  it('defaults monetization master off; pilots listed', () => {
    const flags = getMonetizationFlags();
    expect(flags.CREDIT_MONETIZATION_ENABLED).toBe(false);
    expect(isToolMonetizationActive('SC-008', flags)).toBe(false);
    expect(isToolMonetizationActive('SC-008', { ...flags, CREDIT_MONETIZATION_ENABLED: true })).toBe(
      true
    );
    expect(isToolMonetizationActive('SC-001', { ...flags, CREDIT_MONETIZATION_ENABLED: true })).toBe(
      false
    );
  });
});
