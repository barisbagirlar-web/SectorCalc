/**
 * Tolerance accumulation for dimensional chains (SC-008 foundation).
 * Worst-case = arithmetic sum of bounds (pessimistic, guaranteed).
 * RSS = root-sum-square (statistical, realistic for independent dims).
 * Invariant locked: RSS bounds never exceed worst-case bounds.
 */
import { D, Decimal } from './engine.js';
import { CalcError } from './guards.js';
import { requireFinite, requireNonNegative } from './guards.js';

export interface Tolerance {
  readonly nominal: Decimal;
  readonly plus: Decimal;
  readonly minus: Decimal;
}

export function tol(nominal: Decimal.Value, plus: Decimal.Value, minus: Decimal.Value): Tolerance {
  return {
    nominal: requireFinite(nominal, 'nominal'),
    plus: requireNonNegative(plus, 'plus'),
    minus: requireNonNegative(minus, 'minus')
  };
}

export function worstCaseSum(parts: Tolerance[]): Tolerance {
  if (parts.length === 0) throw new CalcError('E_INVALID_INPUT', 'worstCaseSum needs >= 1 part');
  let nominal = D(0);
  let plus = D(0);
  let minus = D(0);
  for (const p of parts) {
    nominal = nominal.plus(p.nominal);
    plus = plus.plus(p.plus);
    minus = minus.plus(p.minus);
  }
  return { nominal, plus, minus };
}

export function rssSum(parts: Tolerance[]): Tolerance {
  if (parts.length === 0) throw new CalcError('E_INVALID_INPUT', 'rssSum needs >= 1 part');
  let nominal = D(0);
  let plusSq = D(0);
  let minusSq = D(0);
  for (const p of parts) {
    nominal = nominal.plus(p.nominal);
    plusSq = plusSq.plus(p.plus.pow(2));
    minusSq = minusSq.plus(p.minus.pow(2));
  }
  return { nominal, plus: plusSq.sqrt(), minus: minusSq.sqrt() };
}

export function tolContains(t: Tolerance, value: Decimal.Value): boolean {
  const v = D(value);
  return v.gte(t.nominal.minus(t.minus)) && v.lte(t.nominal.plus(t.plus));
}
