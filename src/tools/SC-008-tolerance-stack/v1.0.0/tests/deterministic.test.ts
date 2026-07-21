import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';

describe('SC-008 determinism', () => {
  it('1000 runs identical', () => {
    const i = {
      components: [
        { name: 'A', nominal: 10, tol: 0.2, distribution: 'normal' as const },
        { name: 'B', nominal: 20, tol: 0.3, distribution: 'normal' as const }
      ],
      usl: 31.5, lsl: 28.5, seed: 1, iterations: 50
    };
    const first = JSON.stringify(calculate(i));
    for (let k = 0; k < 1000; k++) expect(JSON.stringify(calculate(i))).toBe(first);
  });
});
