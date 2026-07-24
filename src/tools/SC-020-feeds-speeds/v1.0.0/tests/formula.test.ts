import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';
import { MATERIAL_IDS } from '../reference.js';
import { FS_FACTORS, lengthToMm, speedToMPerMin, powerToKw, torqueToNm } from '../../../../core/fs-engine.js';

const base = {
  materialId: 'P2',
  diameterMm: '10',
  teeth: '4',
  vcMPerMin: '150',
  fzMm: '0.05',
  apMm: '5',
  aeMm: '2',
  spindleKw: '7.5',
  spindleTorqueNm: '50',
  stickOutMm: '30',
  noseRadiusMm: '0.8',
  efficiency: '0.8',
  coolant: 'flood',
  interruption: 'continuous',
  toolCost: '45',
  machineCostPerMin: '1.2',
  currency: '$'
};

describe('SC-020 formula', () => {
  it('returns deterministic outputs for identical inputs', () => {
    const a = calculate(base);
    const b = calculate(base);
    expect(a).toEqual(b);
    expect(a.integrity).toBe(b.integrity);
    expect(a.engineVersion).toBe('2.1.0');
  });

  it('computes spindle speed from Vc and D', () => {
    const r = calculate(base);
    // n = 1000*150/(pi*10) ≈ 4774.65
    expect(Number(r.nRpm)).toBeGreaterThan(4700);
    expect(Number(r.nRpm)).toBeLessThan(4850);
  });

  it('covers all 14 ISO materials without throw', () => {
    expect(MATERIAL_IDS).toHaveLength(14);
    for (const id of MATERIAL_IDS) {
      const r = calculate({ ...base, materialId: id });
      expect(r.verdict).toMatch(/RELEASED|CAUTION|DO NOT RUN/);
      expect(r.integrity).toMatch(/^[0-9a-f]{8}$/);
    }
  });

  it('flags overload as DO NOT RUN', () => {
    const r = calculate({ ...base, spindleKw: '0.1', spindleTorqueNm: '0.5', aeMm: '8', apMm: '8' });
    expect(r.verdict).toBe('DO NOT RUN');
    const w = evaluateWarnings({ ...base, spindleKw: '0.1', spindleTorqueNm: '0.5', aeMm: '8', apMm: '8' }, r);
    expect(w.some((x) => x.severity === 'blocking')).toBe(true);
  });
});

describe('FS-ENGINE unit factors', () => {
  it('uses exact SI factors', () => {
    expect(FS_FACTORS.IN_TO_MM.toString()).toBe('25.4');
    expect(FS_FACTORS.SFM_TO_M_PER_MIN.toString()).toBe('0.3048');
    expect(FS_FACTORS.HP_TO_KW.toString()).toBe('0.7457');
    expect(FS_FACTORS.FT_LB_TO_NM.toString()).toBe('1.3558');
    expect(lengthToMm('1', 'in').toString()).toBe('25.4');
    expect(speedToMPerMin('1', 'SFM').toString()).toBe('0.3048');
    expect(powerToKw('1', 'HP').toString()).toBe('0.7457');
    expect(torqueToNm('1', 'ft·lb').toString()).toBe('1.3558');
  });
});
