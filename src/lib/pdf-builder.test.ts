import { describe, it, expect } from 'vitest';
import { buildReportLines } from './pdf-builder.js';

const input = {
  toolCode: 'SC-010', trueMonthlyCost: '5200.00', currency: 'USD',
  costMultiplier: '1.49', hiddenCostPct: '48.6',
  breakdown: [{ item: 'Gross salary (estimated)', amount: '4545.45', pct: '87.4' }],
  warnings: [{ severity: 'TIP', message: 'insight' }],
  steps: [{ step: 1, description: 'Normalize', result: '3500.00' }]
};

describe('pdf-builder', () => {
  it('includes title and hero', () => {
    const lines = buildReportLines(input);
    expect(lines[0]!.style).toBe('title');
    expect(lines.some((l) => l.style === 'hero' && l.text.includes('5200.00'))).toBe(true);
  });

  it('includes every breakdown row', () => {
    const lines = buildReportLines(input);
    expect(lines.some((l) => l.text.includes('Gross salary (estimated)'))).toBe(true);
  });

  it('includes warnings when present', () => {
    const lines = buildReportLines(input);
    expect(lines.some((l) => l.text.includes('[TIP] insight'))).toBe(true);
  });

  it('includes steps', () => {
    const lines = buildReportLines(input);
    expect(lines.some((l) => l.text.includes('1. Normalize = 3500.00'))).toBe(true);
  });
});
