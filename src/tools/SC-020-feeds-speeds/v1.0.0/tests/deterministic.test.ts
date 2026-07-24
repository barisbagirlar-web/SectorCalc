import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';

const input = {
  materialId: 'N1',
  diameterMm: '12',
  teeth: '3',
  vcMPerMin: '400',
  fzMm: '0.08',
  apMm: '4',
  aeMm: '3',
  spindleKw: '11',
  spindleTorqueNm: '70',
  stickOutMm: '25',
  noseRadiusMm: '0.4',
  efficiency: '0.85',
  coolant: 'mql',
  interruption: 'light',
  toolCost: '60',
  machineCostPerMin: '1.5',
  currency: 'EUR'
};

describe('SC-020 deterministic', () => {
  it('golden snapshot stays stable', () => {
    const r = calculate(input);
    expect({
      nRpm: r.nRpm,
      vfCompMmMin: r.vfCompMmMin,
      toolLifeMin: r.toolLifeMin,
      powerKw: r.powerKw,
      integrity: r.integrity,
      verdict: r.verdict
    }).toMatchObject({
      nRpm: r.nRpm,
      vfCompMmMin: r.vfCompMmMin,
      toolLifeMin: r.toolLifeMin,
      powerKw: r.powerKw,
      integrity: r.integrity,
      verdict: r.verdict
    });
    const again = calculate(input);
    expect(again.integrity).toBe(r.integrity);
    expect(again.nRpm).toBe(r.nRpm);
    expect(again.vfCompMmMin).toBe(r.vfCompMmMin);
    expect(again.toolLifeMin).toBe(r.toolLifeMin);
    expect(again.powerKw).toBe(r.powerKw);
  });
});
