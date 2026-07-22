import { describe, it, expect } from 'vitest';
import { calculate, simulateStack } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { D } from '../src/core/engine.js';

function run(comps: { name: string; nominal: number; tol: number }[], usl: number, lsl: number, seed = 1) {
  const input = {
    components: comps.map((c) => ({
      name: c.name,
      nominal: String(c.nominal),
      tol: String(c.tol),
      distribution: 'normal' as const
    })),
    usl: String(usl),
    lsl: String(lsl),
    seed: String(seed),
    iterations: '1500'
  };
  const samples = simulateStack(input.components, input);
  return calculate(input, samples);
}

const two = (t1: number, t2: number) => [
  { name: 'A', nominal: 10, tol: t1 },
  { name: 'B', nominal: 20, tol: t2 }
];

describe('SC-008 benchmark suite (closed-form invariants, 50+ cases)', () => {
  const tolPairs: [number, number][] = [];
  for (const a of [0.05, 0.1, 0.2, 0.3, 0.5]) for (const b of [0.05, 0.1, 0.2, 0.3, 0.5, 0.8]) tolPairs.push([a, b]);

  it.each(tolPairs)('worst = sum & rss = sqrt(sum sq) for tol [%s, %s]', (a, b) => {
    const r = run(two(a, b), 35, 25);
    expect(r.worstPlus).toBe((a + b).toFixed(4));
    expect(D(r.rssPlus).minus(D(Math.sqrt(a * a + b * b))).abs().lt('0.001')).toBe(true);
  });

  it.each([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.5, 2.0, 3.0])('Cpk monotonic in spec half-width %s', (half) => {
    const narrow = run(two(0.2, 0.3), 30 + half * 0.5, 30 - half * 0.5);
    const wide = run(two(0.2, 0.3), 30 + half, 30 - half);
    expect(Number(wide.cpk)).toBeGreaterThanOrEqual(Number(narrow.cpk) - 1e-6);
  });

  it.each([1, 7, 42, 12345, 99999])('deterministic for seed %s', (seed) => {
    expect(run(two(0.2, 0.3), 31.5, 28.5, seed).mcStd).toBe(run(two(0.2, 0.3), 31.5, 28.5, seed).mcStd);
  });

  it.each([10, 30, 50, 100, -20])('nominal-sum offset %s does not corrupt verdict', (off) => {
    // Nominal sum = off; absolute limits must sit around that sum (not around a shifted center).
    const comps = [
      { name: 'P', nominal: off + 10, tol: 0.1 },
      { name: 'Q', nominal: -10, tol: 0.1 }
    ];
    const r = run(comps, off + 0.3, off - 0.3);
    expect(r.worstPlus).toBe('0.2000');
    expect(Number(r.cpk)).toBeGreaterThan(0);
  });
});

describe('SC-008 independent validation set', () => {
  const V = [
    { comps: two(0.2, 0.3), usl: 31.5, lsl: 28.5, worst: '0.5000', rss: 0.3606, cpkMin: 1.0 },
    { comps: two(0.1, 0.1), usl: 32, lsl: 28, worst: '0.2000', rss: 0.1414, cpkMin: 3.0 },
    { comps: two(0.2, 0.3), usl: 30.1, lsl: 29.9, worst: '0.5000', rss: 0.3606, cpkMax: 1.0 },
    { comps: [{ name: 'X', nominal: 5, tol: 0.4 }], usl: 6.5, lsl: 3.5, worst: '0.4000', rss: 0.4, cpkMin: 1.0 },
    { comps: two(0.05, 0.05), usl: 30.5, lsl: 29.5, worst: '0.1000', rss: 0.0707, cpkMin: 2.0 },
    { comps: [{ name: 'X', nominal: 0, tol: 1 }], usl: 3, lsl: -3, worst: '1.0000', rss: 1.0, cpkMin: 1.0 }
  ];

  it.each(V)('validated case matches reference (worst $worst, rss ~$rss)', (v) => {
    const r = run(v.comps, v.usl, v.lsl);
    expect(r.worstPlus).toBe(v.worst);
    expect(D(r.rssPlus).minus(D(v.rss)).abs().lt('0.002')).toBe(true);
    if (v.cpkMin !== undefined) expect(Number(r.cpk)).toBeGreaterThanOrEqual(v.cpkMin);
    if (v.cpkMax !== undefined) expect(Number(r.cpk)).toBeLessThan(v.cpkMax);
  });
});
