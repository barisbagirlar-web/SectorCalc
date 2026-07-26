import { describe, it, expect, beforeEach } from 'vitest';
import { grantCredits, readCredits, writeCredits } from './credits.js';

describe('paddle credits ledger', () => {
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
  });

  it('starts at zero', () => {
    expect(readCredits().balance).toBe(0);
  });

  it('grants credits', () => {
    expect(grantCredits(15, 'txn_a').balance).toBe(15);
    expect(readCredits().balance).toBe(15);
  });

  it('is idempotent for the same txn id', () => {
    grantCredits(5, 'txn_same');
    expect(grantCredits(5, 'txn_same').balance).toBe(5);
  });

  it('rejects non-positive amounts', () => {
    expect(() => grantCredits(0)).toThrow(/positive integer/);
    writeCredits({ balance: 2, updatedAt: new Date().toISOString() });
    expect(readCredits().balance).toBe(2);
  });
});
