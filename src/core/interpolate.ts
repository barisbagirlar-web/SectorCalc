/**
 * Table interpolation for material / standard lookups.
 * Linear: no extrapolation (out of range throws — engineering forbids guessing).
 * Step: right-continuous zero-order hold, upper-clamped to the last value.
 * Reuses conservation.assertMonotonicIncreasing so the error code (E_MONOTONIC)
 * is identical across the whole engine.
 */
import { D, Decimal } from './engine.js';
import { CalcError } from './guards.js';
import { assertMonotonicIncreasing } from './conservation.js';

function toDecimals(values: Decimal.Value[], label: string): Decimal[] {
  return values.map((v, i) => D(v, `${label}[${i}]`));
}

function checkPairs(xs: Decimal[], ys: Decimal[]): void {
  if (xs.length !== ys.length) {
    throw new CalcError('E_INVALID_INPUT', `xs/ys length mismatch: ${xs.length} vs ${ys.length}`);
  }
  assertMonotonicIncreasing(xs, 'xs');
}

export function linearInterpolate(xs: Decimal.Value[], ys: Decimal.Value[], x: Decimal.Value): Decimal {
  const X = toDecimals(xs, 'xs');
  const Y = toDecimals(ys, 'ys');
  if (X.length < 2) throw new CalcError('E_INVALID_INPUT', 'linearInterpolate needs >= 2 points');
  checkPairs(X, Y);
  const xv = D(x, 'x');
  // Length >= 2 is guarded above; ! satisfies noUncheckedIndexedAccess.
  if (xv.lt(X[0]!) || xv.gt(X[X.length - 1]!)) {
    throw new CalcError('E_OUT_OF_RANGE', `x=${xv.toString()} outside [${X[0]!.toString()}, ${X[X.length - 1]!.toString()}] (no extrapolation)`);
  }
  let i = 0;
  while (i < X.length - 2 && xv.gt(X[i + 1]!)) i++;
  const denom = X[i + 1]!.minus(X[i]!); // > 0 because xs strictly increasing
  const t = xv.minus(X[i]!).div(denom);
  return Y[i]!.plus(t.times(Y[i + 1]!.minus(Y[i]!)));
}

export function stepInterpolate(xs: Decimal.Value[], ys: Decimal.Value[], x: Decimal.Value): Decimal {
  const X = toDecimals(xs, 'xs');
  const Y = toDecimals(ys, 'ys');
  if (X.length < 1) throw new CalcError('E_INVALID_INPUT', 'stepInterpolate needs >= 1 point');
  checkPairs(X, Y);
  const xv = D(x, 'x');
  if (xv.lt(X[0]!)) {
    throw new CalcError('E_OUT_OF_RANGE', `x=${xv.toString()} below first node ${X[0]!.toString()}`);
  }
  let i = 0;
  while (i < X.length - 1 && xv.gte(X[i + 1]!)) i++;
  return Y[i]!;
}
