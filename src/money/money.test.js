import { describe, it, expect } from 'vitest';
import { Money, money } from './money.js';
import { d } from './decimal.js';

describe('money (Decimal.js)', () => {
  it('0.1 + 0.2 is exact', () => {
    const total = money('0.1', 'USD').add(money('0.2', 'USD'));
    expect(total.toJSON().amount).toBe('0.3');
  });

  it('rejects Number for amount construction', () => {
    expect(() => d(/** @type {any} */ (0.1))).toThrow(/decimal strings/);
  });

  it('JSON round-trip stays strings', () => {
    const m = Money.fromJSON({ amount: '19.99', currency: 'EUR' });
    const json = m.toJSON();
    expect(typeof json.amount).toBe('string');
    expect(json.amount).toBe('19.99');
    expect(json.currency).toBe('EUR');
  });

  it('mul uses decimal string factor', () => {
    expect(money('10.00', 'USD').mul('1.21').toJSON().amount).toBe('12.1');
  });
});
