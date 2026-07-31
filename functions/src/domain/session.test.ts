import { describe, expect, it } from 'vitest';
import { openProfessionalSession, type ProfessionalSession } from './session';
import { emptyWallet, type CreditWallet } from './types';

const NOW = Date.parse('2026-07-31T12:00:00Z');
const DAY = 86_400_000;
const HOUR = 3_600_000;

let seq = 0;
function newId(): string {
  seq += 1;
  return `id-${seq}`;
}

function wallet(over: Partial<CreditWallet> = {}): CreditWallet {
  return {
    ...emptyWallet('uid', new Date(NOW).toISOString()),
    purchasedCredits: 20,
    ...over
  };
}

function existingActive(over: Partial<ProfessionalSession> = {}): ProfessionalSession {
  return {
    id: 'existing-session',
    userId: 'uid',
    toolId: 'SC-029',
    pricingTier: 'ADVANCED',
    creditCost: 15,
    status: 'ACTIVE',
    startedAt: new Date(NOW - HOUR).toISOString(),
    expiresAt: new Date(NOW + DAY).toISOString(),
    createdAt: new Date(NOW - HOUR).toISOString(),
    ...over
  };
}

describe('openProfessionalSession — debit + idempotency', () => {
  it('wallet 20 → session cost 15 → balance 5, exactly one debit', () => {
    const out = openProfessionalSession({
      wallet: wallet(),
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: NOW,
      idFactory: newId
    });
    if (!out.ok) throw new Error('expected ok');
    expect(out.reused).toBe(false);
    expect(out.debit).toBe(15);
    expect(out.wallet.purchasedCredits).toBe(5);
    expect(out.session.expiresAt).toBe(new Date(NOW + 24 * HOUR).toISOString());
  });

  it('same active session reopened → reused, NO second debit', () => {
    const first = openProfessionalSession({
      wallet: wallet(),
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: NOW,
      idFactory: newId
    });
    if (!first.ok) throw new Error('expected ok');

    const retry = openProfessionalSession({
      wallet: first.wallet, // wallet already debited to 5
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: first.session, // the same live window
      nowMs: NOW + 1000,
      idFactory: newId
    });
    if (!retry.ok) throw new Error('expected ok');
    expect(retry.reused).toBe(true);
    expect(retry.debit).toBe(0);
    expect(retry.wallet.purchasedCredits).toBe(5);
  });

  it('expired session + balance 5 → denied (no free reopen)', () => {
    const out = openProfessionalSession({
      wallet: wallet({ purchasedCredits: 5 }),
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: existingActive({ expiresAt: new Date(NOW - 1000).toISOString() }),
      nowMs: NOW,
      idFactory: newId
    });
    if (out.ok) throw new Error('expected error');
    expect(out.code).toBe('INSUFFICIENT_CREDITS');
    expect(out.requiredCredits).toBe(15);
    expect(out.availableCredits).toBe(5);
  });

  it('exact expiry boundary is NOT a live session (server-time rule)', () => {
    const out = openProfessionalSession({
      wallet: wallet(),
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: existingActive({ expiresAt: new Date(NOW).toISOString() }),
      nowMs: NOW,
      idFactory: newId
    });
    if (!out.ok) throw new Error('expected ok');
    expect(out.reused).toBe(false);
    expect(out.debit).toBe(15);
  });

  it('creditDebt blocks opening with BILLING_DEBT', () => {
    const out = openProfessionalSession({
      wallet: wallet({ creditDebt: 10 }),
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: NOW,
      idFactory: newId
    });
    if (out.ok) throw new Error('expected error');
    expect(out.code).toBe('BILLING_DEBT');
  });

  it('two-tab concurrency: the second transaction sees the first session (reuse)', () => {
    // Tab A opens the session first.
    const tabA = openProfessionalSession({
      wallet: wallet(),
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: null,
      nowMs: NOW,
      idFactory: newId
    });
    if (!tabA.ok) throw new Error('expected ok');
    // Tab B lands after tab A committed and reads the now-live session.
    const tabB = openProfessionalSession({
      wallet: tabA.wallet,
      userId: 'uid',
      toolId: 'SC-029',
      pricingTier: 'ADVANCED',
      creditCost: 15,
      monetizationEnabled: true,
      existingActive: tabA.session,
      nowMs: NOW + 2000,
      idFactory: newId
    });
    if (!tabB.ok) throw new Error('expected ok');
    expect(tabB.reused).toBe(true);
    expect(tabB.debit).toBe(0);
    expect(tabA.wallet.purchasedCredits).toBe(5); // only tab A debited
  });
});
