/**
 * Deterministic Monte Carlo primitives — FULL DECIMAL (no Number arithmetic).
 * Distribution sampling for the P2 contract: normal, uniform, truncated-normal
 * (rejection), triangular. These are the single source of truth for sampling;
 * the UI composes them, and formula.ts calculate() is the math SSOT on samples.
 *
 * Design decisions (documented):
 *  - PRNG: Decimal Linear Congruential Generator (Numerical Recipes constants).
 *    mulberry32/xorshift need integer bit-ops (imul/xor/shift) that Decimal cannot
 *    express; LCG uses only *, +, mod -> fully Decimal. Adequate for Monte Carlo
 *    integration. Documented fallback for a higher-quality stream: mulberry32
 *    (bit-ops in Number, output -> Decimal) — requires an explicit exception.
 *  - Normal sampling: inverse-CDF method (NOT Box-Muller). Box-Muller needs cos,
 *    which decimal.js does not provide. The inverse standard-normal CDF uses
 *    Acklam's rational approximation (~1e-9 relative error) with only +,-,*,/,
 *    sqrt,ln — all in decimal.js. Industry-standard alternative to a Taylor series
 *    (which diverges in the tails and is impractical for quantiles).
 *  - Reproducibility: same seed -> identical Decimal stream -> identical report.
 */
import { D, Decimal } from './engine.js';
import { CalcError } from './guards.js';

const LCG_A = D('1664525');
const LCG_C = D('1013904223');
const LCG_M = D('4294967296'); // 2^32

/** Decimal LCG. Returns a generator yielding Decimal in [0,1). */
export function lcg(seed: Decimal.Value): () => Decimal {
  let state = D(seed).mod(LCG_M);
  return function next(): Decimal {
    state = LCG_A.times(state).plus(LCG_C).mod(LCG_M);
    return state.div(LCG_M);
  };
}

// Acklam inverse-normal-CDF coefficients.
const A = [D('-39.69683028665376'), D('220.9460984245205'), D('-275.9285104469687'), D('138.3577518672690'), D('-30.66479806614716'), D('2.506628277459239')];
const B = [D('-54.47609879822406'), D('161.5858368580409'), D('-155.6989798598866'), D('66.80131188771972'), D('-13.28068155288572')];
const CC = [D('-0.007784894002430293'), D('-0.3223964580411365'), D('-2.400758277161838'), D('-2.549732539343734'), D('4.374664141464968'), D('2.938163982698783')];
const DD = [D('0.007784695709041462'), D('0.3224671290700398'), D('2.445134137142996'), D('3.754408661907416')];
const P_LOW = D('0.02425');
const P_HIGH = D('0.97575');

function horner(coeffs: Decimal[], x: Decimal): Decimal {
  let acc = D(0);
  for (let i = 0; i < coeffs.length; i++) acc = acc.times(x).plus(coeffs[i]!);
  return acc;
}

/** Inverse standard normal CDF, Acklam rational approximation (~1e-9). Full Decimal. */
export function invNormCdf(p: Decimal.Value): Decimal {
  const pv = D(p);
  if (pv.lte(0) || pv.gte(1)) throw new CalcError('E_OUT_OF_RANGE', `invNormCdf p must be in (0,1), got ${pv.toString()}`);
  // Acklam denominators end with (...)*x + 1, not horner(...)+1 (one multiply missing).
  if (pv.lt(P_LOW)) {
    const q = pv.ln().times(-2).sqrt();
    return horner(CC, q).div(horner(DD, q).times(q).plus(1));
  }
  if (pv.lte(P_HIGH)) {
    const q = pv.minus('0.5');
    const r = q.times(q);
    return horner(A, r).times(q).div(horner(B, r).times(r).plus(1));
  }
  const q = D(1).minus(pv).ln().times(-2).sqrt();
  return horner(CC, q).div(horner(DD, q).times(q).plus(1)).neg();
}

/** Normal sample via inverse-CDF (single uniform, no trig). Full Decimal. */
export function sampleNormal(rng: () => Decimal, mean: Decimal.Value, std: Decimal.Value): Decimal {
  const eps = D('1e-12');
  let u = rng();
  if (u.lt(eps)) u = eps;
  if (u.gt(D(1).minus(eps))) u = D(1).minus(eps);
  return D(mean).plus(D(std).times(invNormCdf(u)));
}

/** Uniform sample in [min, max]. Full Decimal. */
export function sampleUniform(rng: () => Decimal, min: Decimal.Value, max: Decimal.Value): Decimal {
  return D(min).plus(rng().times(D(max).minus(min)));
}

/** Truncated normal via rejection sampling. Deterministic (rng is deterministic). */
export function sampleTruncatedNormal(
  rng: () => Decimal,
  mean: Decimal.Value,
  std: Decimal.Value,
  lo: Decimal.Value,
  hi: Decimal.Value
): Decimal {
  const m = D(mean);
  const L = D(lo);
  const H = D(hi);
  for (let i = 0; i < 1000; i++) {
    const x = sampleNormal(rng, m, std);
    if (x.gte(L) && x.lte(H)) return x;
  }
  return sampleNormal(rng, m, std);
}

/** Triangular on [lo, hi] with mode. Inverse-CDF, full Decimal. */
export function sampleTriangular(
  rng: () => Decimal,
  lo: Decimal.Value,
  mode: Decimal.Value,
  hi: Decimal.Value
): Decimal {
  const L = D(lo);
  const M = D(mode);
  const H = D(hi);
  const u = rng();
  const c = M.minus(L).div(H.minus(L));
  if (u.lt(c)) return L.plus(u.times(H.minus(L)).times(M.minus(L)).sqrt());
  return H.minus(D(1).minus(u).times(H.minus(L)).times(H.minus(M)).sqrt());
}
