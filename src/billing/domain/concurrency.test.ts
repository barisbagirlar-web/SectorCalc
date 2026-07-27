import { describe, it, expect } from 'vitest';
import { openProfessionalSession } from './session.js';
import { emptyWallet } from './types.js';

describe('concurrency: 20 simultaneous SC-020 opens (domain serialization)', () => {
  it('exactly one debit when first wins; others reuse → wallet 85', () => {
    let n = 0;
    const idFactory = () => `id_${++n}`;
    const now = Date.parse('2026-07-27T12:00:00.000Z');
    let wallet = { ...emptyWallet('u1', new Date(now).toISOString()), purchasedCredits: 100 };
    let active = null as import('./session.js').ProfessionalSession | null;
    let debits = 0;

    // Simulate serialized DB lock: 20 sequential attempts under one lock.
    for (let i = 0; i < 20; i++) {
      const res = openProfessionalSession({
        wallet,
        userId: 'u1',
        toolId: 'SC-020',
        pricingTier: 'ADVANCED',
        creditCost: 15,
        monetizationEnabled: true,
        existingActive: active,
        nowMs: now + i,
        idFactory
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      if (!res.reused) {
        debits += res.debit;
        wallet = res.wallet;
        active = res.session;
      }
    }

    expect(debits).toBe(15);
    expect(wallet.purchasedCredits).toBe(85);
    expect(active?.status).toBe('ACTIVE');
  });
});
