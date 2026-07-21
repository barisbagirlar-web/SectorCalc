import { describe, it, expect } from 'vitest';
import { calculate, simulateStack } from '../formula.js';
import { D } from '../../../../core/engine.js';

const two = {
  components: [
    { name: 'A', nominal: 10, tol: 0.2, distribution: 'normal' as const },
    { name: 'B', nominal: 20, tol: 0.3, distribution: 'normal' as const }
  ],
  usl: 31.5, lsl: 28.5, seed: 1, iterations: 500
};

describe('SC-008 formula', () => {
  it('worst = sum of tolerances', () => { expect(calculate(two).worstPlus).toBe('0.5000'); });
  it('rss = sqrt(sum tol^2)', () => { expect(D(calculate(two).rssPlus).minus(D('0.3606')).abs().lt('0.001')).toBe(true); });
  it('monte carlo mean near nominal sum', () => { expect(D(calculate(two).mcMean).minus(30).abs().lt('0.1')).toBe(true); });
  it('deterministic for same seed', () => { expect(calculate(two).mcStd).toBe(calculate({ ...two }).mcStd); });
  it('different seed differs', () => { expect(calculate(two).mcStd).not.toBe(calculate({ ...two, seed: 99 }).mcStd); });
  it('cp computed', () => { expect(D(calculate(two).cp).gt(0)).toBe(true); });
  it('cpk computed and <= cp', () => { const r = calculate(two); expect(D(r.cpk).lte(r.cp)).toBe(true); });
  it('centered stack cpk near cp', () => { const r = calculate(two); expect(D(r.cpk).minus(r.cp).abs().lt('0.3')).toBe(true); });
  it('empirical ppm low for wide spec', () => { expect(D(calculate(two).ppm).gte(0)).toBe(true); });
  it('empirical ppm high for tight spec', () => { const r = calculate({ ...two, usl: 30.1, lsl: 29.9 }); expect(D(r.ppm).gt(0)).toBe(true); });
  it('pareto sorted desc and sums ~100', () => {
    const r = calculate(two);
    expect(D(r.pareto[0]!.pct).gte(r.pareto[1]!.pct)).toBe(true);
    const sum = r.pareto.reduce((a, p) => a.plus(p.pct), D(0));
    expect(sum.minus(100).abs().lt('0.5')).toBe(true);
  });
  it('uniform distribution runs', () => {
    const r = calculate({ ...two, components: [{ name: 'U', nominal: 10, tol: 0.5, distribution: 'uniform' }] });
    expect(D(r.mcStd).gt(0)).toBe(true);
  });
  it('low cpk widens spread', () => {
    const wide = calculate({ ...two, components: [{ name: 'A', nominal: 10, tol: 0.2, distribution: 'normal', cpk: 0.5 }] });
    const narrow = calculate({ ...two, components: [{ name: 'A', nominal: 10, tol: 0.2, distribution: 'normal', cpk: 1.33 }] });
    expect(D(wide.mcStd).gt(narrow.mcStd)).toBe(true);
  });
  it('throws USL <= LSL', () => { expect(() => calculate({ ...two, usl: 28, lsl: 30 })).toThrow(); });
  it('throws empty components', () => { expect(() => calculate({ ...two, components: [] })).toThrow(); });
  it('throws negative tol and iterations<1', () => {
    expect(() => calculate({ ...two, components: [{ name: 'X', nominal: 1, tol: -1, distribution: 'normal' }] })).toThrow();
    expect(() => simulateStack(two.components, { ...two, iterations: 0 })).toThrow();
  });
  it('defaults seed when omitted', () => {
    const r = calculate({ components: two.components, usl: 31.5, lsl: 28.5, iterations: 100 });
    expect(r.seed).toBe(12345);
    expect(r.iterations).toBe(100);
  });
  it('zero tolerances -> std 0 capability and zero pareto share', () => {
    const r = calculate({
      components: [{ name: 'Z', nominal: 10, tol: 0, distribution: 'normal' }],
      usl: 11, lsl: 9, seed: 1, iterations: 50
    });
    expect(r.mcStd).toBe('0.0000');
    expect(r.cp).toBe('0.0000');
    expect(r.pareto[0]!.pct).toBe('0.0');
  });
  it('defaults iterations to 5000 when omitted', () => {
    const r = calculate({
      components: [{ name: 'A', nominal: 10, tol: 0.1, distribution: 'normal' }],
      usl: 11, lsl: 9, seed: 1
    });
    expect(r.iterations).toBe(5000);
    expect(r.seed).toBe(1);
  });
  it('simulateStack throws on negative tol (path not reached via calculate)', () => {
    expect(() => simulateStack(
      [{ name: 'X', nominal: 1, tol: -1, distribution: 'normal' }],
      { components: [], usl: 1, lsl: 0, seed: 1, iterations: 10 }
    )).toThrow();
  });
});
