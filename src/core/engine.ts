/**
 * SECTORCALC ENGINE — single Decimal configuration point.
 * Every tool imports Decimal from HERE, so precision and rounding
 * are defined once and never drift.
 */
import Decimal from 'decimal.js';

// Engineering precision: Decimal128 level.
Decimal.set({
  precision: 34,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -34,
  toExpPos: 34
});

/** Safely convert a value to Decimal. Throws on empty / non-finite input. */
export function D(value: Decimal.Value | null | undefined): Decimal {
  if (value === null || value === undefined || value === '') {
    throw new Error('[engine] Empty value passed to D()');
  }
  const d = new Decimal(value);
  if (!d.isFinite()) {
    throw new Error(`[engine] Non-finite value: ${String(value)}`);
  }
  return d;
}

/** Format a Decimal to fixed places as a string (never back to Number). */
export function fix(decimal: Decimal, places = 4): string {
  return decimal.toFixed(places);
}

export { Decimal };
