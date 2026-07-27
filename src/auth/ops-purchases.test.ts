import { describe, it, expect } from 'vitest';
import { enrichOpsPurchases, packBuyerSummary, type OpsPurchaseRow } from './ops-admin.js';
import type { UserProfile } from './profile.js';

function purchase(partial: Partial<OpsPurchaseRow> & { uid: string }): OpsPurchaseRow {
  return {
    id: partial.id || 'p1',
    uid: partial.uid,
    email: partial.email || '',
    displayName: partial.displayName || '',
    credits: partial.credits ?? 15,
    amountLabel: partial.amountLabel || '$7.99',
    txnId: partial.txnId || 'txn1',
    source: partial.source || 'checkout',
    at: partial.at || '2026-07-01T12:00:00.000Z'
  };
}

describe('enrichOpsPurchases', () => {
  it('fills missing email and displayName from profile', () => {
    const profiles: UserProfile[] = [
      {
        uid: 'u1',
        email: 'buyer@example.com',
        displayName: 'Ada Buyer',
        photoURL: '',
        credits: 15
      }
    ];
    const rows = enrichOpsPurchases([purchase({ uid: 'u1', email: '', displayName: '' })], profiles);
    expect(rows[0]?.email).toBe('buyer@example.com');
    expect(rows[0]?.displayName).toBe('Ada Buyer');
  });

  it('keeps purchase email when already present', () => {
    const profiles: UserProfile[] = [
      {
        uid: 'u1',
        email: 'profile@example.com',
        displayName: 'Profile Name',
        photoURL: '',
        credits: 5
      }
    ];
    const rows = enrichOpsPurchases(
      [purchase({ uid: 'u1', email: 'checkout@example.com', displayName: '' })],
      profiles
    );
    expect(rows[0]?.email).toBe('checkout@example.com');
    expect(rows[0]?.displayName).toBe('Profile Name');
  });
});

describe('packBuyerSummary', () => {
  it('groups buyers for a pack SKU', () => {
    const rows = [
      purchase({ uid: 'u1', email: 'a@x.com', displayName: 'A', credits: 15, txnId: 't1' }),
      purchase({ uid: 'u1', email: 'a@x.com', displayName: 'A', credits: 15, txnId: 't2' }),
      purchase({ uid: 'u2', email: 'b@x.com', displayName: 'B', credits: 15, txnId: 't3' }),
      purchase({ uid: 'u3', email: 'c@x.com', displayName: 'C', credits: 5, txnId: 't4' })
    ];
    const summary = packBuyerSummary(rows, 15);
    expect(summary.sales).toBe(3);
    expect(summary.buyers).toHaveLength(2);
    expect(summary.buyers.find((b) => b.uid === 'u1')?.count).toBe(2);
  });
});
