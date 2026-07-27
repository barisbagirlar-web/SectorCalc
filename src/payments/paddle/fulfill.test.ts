import { describe, it, expect, beforeEach } from 'vitest';
import { fulfillCheckoutCompleted } from './fulfill.js';
import { readCredits, writeCredits } from './credits.js';
import { PADDLE_SANDBOX_PRICE_IDS } from '../../billing/credit-packages.js';

describe('fulfillCheckoutCompleted', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
        clear: () => store.clear()
      }
    });
    writeCredits({ balance: 0, updatedAt: new Date().toISOString() });
  });

  it('grants from line-item price_id (workshop 100)', () => {
    const r = fulfillCheckoutCompleted({
      name: 'checkout.completed',
      data: {
        transaction_id: 'txn_items',
        items: [{ price_id: PADDLE_SANDBOX_PRICE_IDS.workshop, quantity: 1 }]
      }
    });
    expect(r.source).toBe('items');
    expect(r.granted).toBe(100);
    expect(readCredits().balance).toBe(100);
  });

  it('falls back to custom_data.credits', () => {
    const r = fulfillCheckoutCompleted({
      name: 'checkout.completed',
      data: {
        id: 'txn_custom',
        custom_data: { product: 'credit_pack', credits: '20' },
        items: []
      }
    });
    expect(r.source).toBe('custom_data');
    expect(r.granted).toBe(20);
  });

  it('falls back to pending credits', () => {
    const r = fulfillCheckoutCompleted(
      {
        name: 'checkout.completed',
        data: { transaction_id: 'txn_pending', items: [] }
      },
      300
    );
    expect(r.source).toBe('pending');
    expect(r.granted).toBe(300);
  });

  it('ignores non-completed events', () => {
    const r = fulfillCheckoutCompleted({ name: 'checkout.closed' }, 100);
    expect(r.granted).toBe(0);
    expect(readCredits().balance).toBe(0);
  });

  it('is idempotent per transaction id', () => {
    fulfillCheckoutCompleted({
      name: 'checkout.completed',
      data: {
        transaction_id: 'txn_once',
        custom_data: { credits: '20' }
      }
    });
    fulfillCheckoutCompleted({
      name: 'checkout.completed',
      data: {
        transaction_id: 'txn_once',
        custom_data: { credits: '20' }
      }
    });
    expect(readCredits().balance).toBe(20);
  });
});
