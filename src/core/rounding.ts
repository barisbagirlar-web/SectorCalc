/**
 * Rounding discipline. Explicit modes only — never implicit float truncation.
 * halfUp for general display, halfEven (banker's) for finance, significant
 * figures for measurements, truncate for floor-style cuts.
 */
import { Decimal } from './engine.js';

export function roundHalfUp(d: Decimal.Value, places: number): Decimal {
  return new Decimal(d).toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
}

export function roundHalfEven(d: Decimal.Value, places: number): Decimal {
  return new Decimal(d).toDecimalPlaces(places, Decimal.ROUND_HALF_EVEN);
}

export function roundToSigFigs(d: Decimal.Value, figs: number): Decimal {
  return new Decimal(d).toSignificantDigits(figs, Decimal.ROUND_HALF_UP);
}

export function truncate(d: Decimal.Value, places: number): Decimal {
  return new Decimal(d).toDecimalPlaces(places, Decimal.ROUND_DOWN);
}
