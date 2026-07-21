import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';

const base = { designLoadN: 50000, weldLengthMm: 200, weldStrengthMpa: 480, safetyFactor: 2, materialThicknessMm: 10 };

describe('SC-001 warnings', () => {
  it('CRITICAL + INFO when throat exceeds thickness on a fillet', () => {
    const i = { ...base, designLoadN: 5000000, materialThicknessMm: 4 };
    const w = evaluateWarnings(i, calculate(i));
    expect(w.some((x) => x.code === 'THROAT_EXCEEDS_THICKNESS')).toBe(true);
    expect(w.some((x) => x.code === 'FILLET_FACTOR_NOTE')).toBe(true);
  });
  it('clean butt: no CRITICAL, no WARNING, no INFO', () => {
    const i = { ...base, jointType: 'butt' as const, designLoadN: 1000, materialThicknessMm: 25, safetyFactor: 2 };
    const w = evaluateWarnings(i, calculate(i));
    expect(w.some((x) => x.code === 'THROAT_EXCEEDS_THICKNESS')).toBe(false);
    expect(w.some((x) => x.code === 'LOW_SAFETY_FACTOR')).toBe(false);
    expect(w.some((x) => x.code === 'FILLET_FACTOR_NOTE')).toBe(false);
  });
  it('WARNING on low safety factor', () => {
    const i = { ...base, safetyFactor: 1.2 };
    expect(evaluateWarnings(i, calculate(i)).some((x) => x.code === 'LOW_SAFETY_FACTOR')).toBe(true);
  });
  it('always emits a TIP', () => {
    expect(evaluateWarnings(base, calculate(base)).some((x) => x.severity === 'TIP')).toBe(true);
  });
});
