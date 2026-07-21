/**
 * Money value object. Amounts are always decimal strings in JSON.
 */
import { d } from './decimal.js';

/**
 * @typedef {{ amount: string, currency: string }} MoneyJSON
 */

export class Money {
  /**
   * @param {string} amount
   * @param {string} currency ISO 4217
   */
  constructor(amount, currency) {
    if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
      throw new RangeError('currency must be ISO 4217 (e.g. USD)');
    }
    this._amount = d(amount);
    this.currency = currency;
  }

  /** @param {MoneyJSON} json */
  static fromJSON(json) {
    return new Money(json.amount, json.currency);
  }

  /** @returns {MoneyJSON} */
  toJSON() {
    return {
      amount: this._amount.toFixed(),
      currency: this.currency
    };
  }

  /** @returns {string} */
  toString() {
    return `${this._amount.toFixed()} ${this.currency}`;
  }

  /**
   * @param {Money} other
   * @returns {Money}
   */
  add(other) {
    this.#assertSameCurrency(other);
    return new Money(this._amount.plus(other._amount).toFixed(), this.currency);
  }

  /**
   * @param {Money} other
   * @returns {Money}
   */
  sub(other) {
    this.#assertSameCurrency(other);
    return new Money(this._amount.minus(other._amount).toFixed(), this.currency);
  }

  /**
   * @param {string} factor decimal string multiplier
   * @returns {Money}
   */
  mul(factor) {
    return new Money(this._amount.times(d(factor)).toFixed(), this.currency);
  }

  /**
   * @param {Money} other
   * @returns {boolean}
   */
  equals(other) {
    return (
      other instanceof Money &&
      this.currency === other.currency &&
      this._amount.equals(other._amount)
    );
  }

  /** @returns {import('decimal.js').default} */
  get decimal() {
    return this._amount;
  }

  /** @param {Money} other */
  #assertSameCurrency(other) {
    if (!(other instanceof Money)) {
      throw new TypeError('expected Money');
    }
    if (other.currency !== this.currency) {
      throw new RangeError(`currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}

/**
 * @param {string} amount
 * @param {string} currency
 */
export function money(amount, currency) {
  return new Money(amount, currency);
}
