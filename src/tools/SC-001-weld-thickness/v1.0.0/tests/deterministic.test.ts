import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';

describe('SC-001 determinism', () => {
  it('1000 runs identical', () => {
    const i = { designLoadN: 50000, weldLengthMm: 200, weldStrengthMpa: 480, safetyFactor: 2, materialThicknessMm: 10, jointType: 'fillet' as const };
    const first = JSON.stringify(calculate(i));
    for (let k = 0; k < 1000; k++) expect(JSON.stringify(calculate(i))).toBe(first);
  });
});
