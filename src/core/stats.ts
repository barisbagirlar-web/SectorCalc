/**
 * Descriptive statistics + process capability (SC-019 foundation).
 * stddev is the SAMPLE estimator (n-1); population variant is out of scope.
 * percentile uses R type-7 / Excel PERCENTILE.INC linear interpolation.
 * Invariant locked: when mu is centered, Cpk == Cp.
 */
import { D, Decimal } from './engine.js';
import { CalcError } from './guards.js';

function asDecimals(values: Decimal.Value[], label: string): Decimal[] {
  if (values.length === 0) throw new CalcError('E_INVALID_INPUT', `${label} must not be empty`);
  return values.map((v, i) => D(v, `${label}[${i}]`));
}

export function mean(values: Decimal.Value[]): Decimal {
  const xs = asDecimals(values, 'values');
  const sum = xs.reduce((acc, v) => acc.plus(v), D(0));
  return sum.div(xs.length);
}

export function stddev(values: Decimal.Value[]): Decimal {
  const xs = asDecimals(values, 'values');
  if (xs.length < 2) throw new CalcError('E_INVALID_INPUT', 'stddev needs >= 2 values (sample, n-1)');
  const mu = mean(values);
  const sq = xs.reduce((acc, v) => acc.plus(v.minus(mu).pow(2)), D(0));
  return sq.div(xs.length - 1).sqrt();
}

export function percentile(values: Decimal.Value[], p: Decimal.Value): Decimal {
  const xs = asDecimals(values, 'values').slice().sort((a, b) => a.cmp(b));
  const pf = D(p, 'p');
  if (pf.lt(0) || pf.gt(1)) throw new CalcError('E_OUT_OF_RANGE', `p must be in [0,1], got ${pf.toString()}`);
  // Length >= 1 from asDecimals; ! satisfies noUncheckedIndexedAccess.
  if (xs.length === 1) return xs[0]!;
  const h = D(xs.length - 1).times(pf);
  const lo = Math.floor(h.toNumber());
  const frac = h.minus(lo);
  const hi = Math.min(lo + 1, xs.length - 1);
  return xs[lo]!.plus(frac.times(xs[hi]!.minus(xs[lo]!)));
}

function capGuards(usl: Decimal.Value, lsl: Decimal.Value, sigma: Decimal.Value): { u: Decimal; l: Decimal; s: Decimal } {
  const u = D(usl, 'USL');
  const l = D(lsl, 'LSL');
  const s = D(sigma, 'sigma');
  if (s.lte(0)) throw new CalcError('E_NON_POSITIVE', `sigma must be > 0, got ${s.toString()}`);
  if (u.lte(l)) throw new CalcError('E_INVALID_INPUT', `USL must be > LSL, got USL=${u.toString()} LSL=${l.toString()}`);
  return { u, l, s };
}

export function cp(usl: Decimal.Value, lsl: Decimal.Value, sigma: Decimal.Value): Decimal {
  const { u, l, s } = capGuards(usl, lsl, sigma);
  return u.minus(l).div(s.times(6));
}

export function cpk(usl: Decimal.Value, lsl: Decimal.Value, mu: Decimal.Value, sigma: Decimal.Value): Decimal {
  const { u, l, s } = capGuards(usl, lsl, sigma);
  const m = D(mu, 'mu');
  const upper = u.minus(m).div(s.times(3));
  const lower = m.minus(l).div(s.times(3));
  return upper.lt(lower) ? upper : lower;
}
