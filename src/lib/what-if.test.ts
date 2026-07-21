import { describe, it, expect } from 'vitest';
import { whatIfToleranceScale, WHAT_IF_SCALES } from './what-if.js';
import type { StackInput } from '../tools/SC-008-tolerance-stack/v1.0.0/formula.js';

const input: StackInput = {
  components: [
    { name: 'A', nominal: '10', tol: '0.2', distribution: 'normal' },
    { name: 'B', nominal: '20', tol: '0.3', distribution: 'normal' }
  ],
  usl: '31.5', lsl: '28.5', seed: 1, iterations: 500
};

describe('what-if', () => {
  it('returns one point per scale', () => {
    expect(whatIfToleranceScale(input).length).toBe(WHAT_IF_SCALES.length);
  });
  it('tighter tolerance (scale < 1) improves Cpk', () => {
    const pts = whatIfToleranceScale(input);
    const tight = pts.find((p) => p.scale === 0.5)!;
    const loose = pts.find((p) => p.scale === 1.5)!;
    expect(Number(tight.cpk)).toBeGreaterThan(Number(loose.cpk));
  });
  it('tighter tolerance does not raise PPM', () => {
    const pts = whatIfToleranceScale(input);
    const tight = pts.find((p) => p.scale === 0.5)!;
    const loose = pts.find((p) => p.scale === 1.5)!;
    expect(Number(tight.ppm)).toBeLessThanOrEqual(Number(loose.ppm));
  });
  it('baseline scale 1 yields a positive Cpk', () => {
    const base = whatIfToleranceScale(input).find((p) => p.scale === 1)!;
    expect(Number(base.cpk)).toBeGreaterThan(0);
  });
});
