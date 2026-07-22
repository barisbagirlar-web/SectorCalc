import { describe, it, expect } from 'vitest';
import { lcg, sampleNormal, sampleUniform, sampleTruncatedNormal, sampleTriangular } from '../src/core/monte-carlo.js';
import { calculate } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { D, Decimal } from '../src/core/engine.js';

// Mirrors the UI sampling so the distribution contract is tested at the engine level.
function sample(rng: () => Decimal, nominal: number, tol: number, dist: string): number {
  const nom = D(nominal);
  const t = D(tol);
  if (dist === 'uniform') return sampleUniform(rng, nom.minus(t), nom.plus(t)).toNumber();
  if (dist === 'triangular') return sampleTriangular(rng, nom.minus(t), nom, nom.plus(t)).toNumber();
  if (dist === 'truncated_normal') return sampleTruncatedNormal(rng, nom, t.div(3), nom.minus(t), nom.plus(t)).toNumber();
  return sampleNormal(rng, nom, t.div(3)).toNumber();
}

function simulate(dims: { nominal: number; tol: number; dist: string }[], seed: number, n: number): number[] {
  const rng = lcg(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (const d of dims) s += sample(rng, d.nominal, d.tol, d.dist);
    out.push(s);
  }
  return out;
}

function calcOn(dims: { name: string; nominal: number; tol: number; dist: string }[], usl: number, lsl: number, seed = 1) {
  const samplesD = simulate(dims, seed, 2000).map((v) => D(v));
  const input = {
    components: dims.map((d) => ({
      name: d.name,
      nominal: String(d.nominal),
      tol: String(d.tol),
      distribution: 'normal' as const
    })),
    usl: String(usl),
    lsl: String(lsl),
    seed: String(seed),
    iterations: '2000'
  };
  return calculate(input, samplesD);
}

describe('distribution primitives', () => {
  it('truncated normal stays within [lo, hi]', () => {
    const rng = lcg(7);
    for (let i = 0; i < 2000; i++) {
      const x = sampleTruncatedNormal(rng, 10, 1, 9, 11);
      expect(x.gte(9)).toBe(true);
      expect(x.lte(11)).toBe(true);
    }
  });

  it('triangular stays within [lo, hi]', () => {
    const rng = lcg(11);
    for (let i = 0; i < 2000; i++) {
      const x = sampleTriangular(rng, 9, 10, 11);
      expect(x.gte(9)).toBe(true);
      expect(x.lte(11)).toBe(true);
    }
  });

  it('uniform stays within [lo, hi]', () => {
    const rng = lcg(3);
    for (let i = 0; i < 1000; i++) {
      const x = sampleUniform(rng, 9, 11);
      expect(x.gte(9)).toBe(true);
      expect(x.lte(11)).toBe(true);
    }
  });
});

describe('distribution contract end-to-end', () => {
  const dims = [
    { name: 'A', nominal: 10, tol: 0.3, dist: 'uniform' },
    { name: 'B', nominal: 20, tol: 0.3, dist: 'uniform' }
  ];

  it('uniform stack yields a finite predicted Cpk', () => {
    const r = calcOn(dims, 31.5, 28.5);
    expect(Number(r.cpk)).toBeGreaterThan(0);
    expect(Number(r.ppm)).toBeGreaterThanOrEqual(0);
  });

  it('truncated-normal stack is reproducible (same seed)', () => {
    const d = dims.map((x) => ({ ...x, dist: 'truncated_normal' }));
    expect(calcOn(d, 31.5, 28.5, 42).mcStd).toBe(calcOn(d, 31.5, 28.5, 42).mcStd);
  });

  it('nominal sum != 0 handled under every distribution (regression for the old bug)', () => {
    for (const dist of ['normal', 'uniform', 'triangular', 'truncated_normal']) {
      const d = [
        { name: 'P', nominal: 50, tol: 0.1, dist },
        { name: 'Q', nominal: -20, tol: 0.1, dist }
      ];
      const r = calcOn(d, 30.3, 29.7);
      expect(r.worstPlus).toBe('0.2000');
      expect(Number(r.cpk)).toBeGreaterThan(0);
    }
  });
});
