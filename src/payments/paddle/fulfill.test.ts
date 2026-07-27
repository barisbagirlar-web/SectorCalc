import { describe, it, expect, beforeEach } from 'vitest';
import { fulfillCheckoutCompleted } from './fulfill.js';
import { readCredits, writeCredits } from './credits.js';

describe('fulfillCheckoutCompleted (server authority)', () => {
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

  it('does not grant credits on checkout.completed', () => {
    const r = fulfillCheckoutCompleted({
      name: 'checkout.completed',
      data: {
        transaction_id: 'txn_items',
        items: [{ price_id: 'pri_anything', quantity: 1 }],
        custom_data: { credits: '1000000' }
      }
    });
    expect(r.granted).toBe(0);
    expect(r.pendingActivation).toBe(true);
    expect(r.source).toBe('server_pending');
    expect(readCredits().balance).toBe(0);
  });

  it('ignores non-completed events', () => {
    const r = fulfillCheckoutCompleted({ name: 'checkout.closed' }, 100);
    expect(r.granted).toBe(0);
    expect(r.pendingActivation).toBe(false);
  });
});
