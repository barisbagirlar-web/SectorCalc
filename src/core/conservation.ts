/**
 * Mathematical invariants as runtime + test assertions. These lock the math on
 * paper: conservation (total == sum of parts), monotonicity, closeness, sign.
 * A formula that violates physics/accounting throws here, deterministically.
 */
import { D, Decimal } from './engine.js';
import { CalcError } from './guards.js';

export function assertConservation(
  total: Decimal.Value,
  parts: Decimal.Value[],
  epsilon: Decimal.Value = '1e-9',
  label = 'total'
): void {
  const t = D(total);
  const sum = parts.reduce<Decimal>((acc, p) => acc.plus(D(p)), D(0));
  if (t.minus(sum).abs().gt(D(epsilon))) {
    throw new CalcError('E_CONSERVATION', `${label} ${t.toString()} != sum(parts) ${sum.toString()}`);
  }
}

export function assertClose(
  a: Decimal.Value,
  b: Decimal.Value,
  epsilon: Decimal.Value = '1e-9',
  label = 'values'
): void {
  const da = D(a);
  const db = D(b);
  if (da.minus(db).abs().gt(D(epsilon))) {
    throw new CalcError('E_CONSERVATION', `${label} not close: ${da.toString()} vs ${db.toString()}`);
  }
}

export function assertAllNonNegative(parts: Decimal.Value[], label = 'part'): void {
  parts.forEach((p, i) => {
    if (D(p).lt(0)) throw new CalcError('E_NEGATIVE', `${label}[${i}] is negative: ${D(p).toString()}`);
  });
}

export function assertMonotonicIncreasing(values: Decimal.Value[], label = 'series'): void {
  for (let i = 1; i < values.length; i++) {
    if (D(values[i]).lte(D(values[i - 1]))) {
      throw new CalcError('E_MONOTONIC', `${label} not strictly increasing at index ${i}`);
    }
  }
}
