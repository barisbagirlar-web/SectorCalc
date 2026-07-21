/**
 * Decimal128-style money engine.
 * Decision #2: Decimal.js only — never JavaScript Number for money/calc.
 */
import Decimal from 'decimal.js';

Decimal.set({
  precision: 34,
  rounding: Decimal.ROUND_HALF_EVEN,
  toExpNeg: -15,
  toExpPos: 20,
  crypto: false
});

export { Decimal };

/**
 * @param {string | Decimal} value
 * @returns {Decimal}
 */
export function d(value) {
  if (value instanceof Decimal) return value;
  if (typeof value !== 'string') {
    throw new TypeError('Money values must be decimal strings (or Decimal). Number is forbidden.');
  }
  if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) {
    throw new RangeError(`Invalid decimal string: ${value}`);
  }
  return new Decimal(value);
}
