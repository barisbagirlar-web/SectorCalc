import { describe, it, expect } from 'vitest';
import { buildReportData } from './report-data.js';
import type { StackResult } from '../engine-api/types.js';

describe('report-data', () => {
  it('returns the private-engine report payload unchanged', () => {
    const reportData = {
      verdict: 'CAPABLE',
      cpk: '1.50',
      ppm: '10',
      riskAnalysis: [],
      insights: ['server insight'],
      standards: ['ASME Y14.5']
    };
    expect(buildReportData({ reportData } as unknown as StackResult)).toBe(reportData);
  });
});
