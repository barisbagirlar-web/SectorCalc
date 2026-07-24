import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';

const base = {
  materialId: 'P1',
  diameterMm: '8',
  teeth: '4',
  vcMPerMin: '180',
  fzMm: '0.04',
  apMm: '3',
  aeMm: '1.5',
  spindleKw: '5.5',
  spindleTorqueNm: '40',
  stickOutMm: '28',
  noseRadiusMm: '0.8',
  efficiency: '0.8',
  coolant: 'flood',
  interruption: 'continuous',
  toolCost: '35',
  machineCostPerMin: '1.0',
  currency: '$'
};

describe('SC-020 warnings', () => {
  it('always includes reference and preview notes', () => {
    const r = calculate(base);
    const w = evaluateWarnings(base, r);
    expect(w.some((x) => x.code === 'REFERENCE_CONSTANTS')).toBe(true);
    expect(w.some((x) => x.code === 'ENGINEERING_PREVIEW')).toBe(true);
  });
});
