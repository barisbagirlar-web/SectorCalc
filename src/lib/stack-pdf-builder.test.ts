import { describe, it, expect } from 'vitest';
import { buildStackReportLines } from './stack-pdf-builder.js';

const input = {
  toolCode: 'SC-008', nominalSum: '30.0000', worstPlus: '0.5000', rssPlus: '0.3606',
  mcMean: '30.0000', mcStd: '0.1800', mcP0013: '29.46', mcP9987: '30.54',
  cp: '2.78', cpk: '2.70', ppm: '0', seed: 12345, iterations: 5000,
  components: [{ name: 'A', nominal: '10', tol: '0.2', distribution: 'normal', pct: '40.0' }],
  warnings: [{ severity: 'TIP', message: 'insight' }],
  steps: [{ step: 1, description: 'Worst-case stack', result: '0.5000' }],
  checksum: 'abc123'
};

describe('stack-pdf-builder', () => {
  it('title first', () => { expect(buildStackReportLines(input)[0]!.style).toBe('title'); });
  it('verdict CAPABLE when cpk>=1', () => { expect(buildStackReportLines(input).some((l) => l.text.includes('CAPABLE'))).toBe(true); });
  it('verdict NOT CAPABLE when cpk<1', () => { expect(buildStackReportLines({ ...input, cpk: '0.8' }).some((l) => l.text.includes('NOT CAPABLE'))).toBe(true); });
  it('includes components, warnings, steps, checksum', () => {
    const lines = buildStackReportLines(input);
    expect(lines.some((l) => l.text.includes('A  10 +/- 0.2'))).toBe(true);
    expect(lines.some((l) => l.text.includes('[TIP] insight'))).toBe(true);
    expect(lines.some((l) => l.text.includes('1. Worst-case stack = 0.5000'))).toBe(true);
    expect(lines.some((l) => l.text.includes('abc123'))).toBe(true);
  });
  it('omits warnings block when none', () => {
    const lines = buildStackReportLines({ ...input, warnings: [] });
    expect(lines.some((l) => l.text === 'Heads up')).toBe(false);
  });
});
