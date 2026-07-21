import { describe, it, expect } from 'vitest';
import { buildWeldReportLines } from './weld-pdf-builder.js';

const input = {
  toolCode: 'SC-001', finalLegMm: '6.00', finalLegIn: '0.24', utilization: '0.612',
  jointType: 'fillet', requiredThroatMm: '4.24', minLegMm: '5.00',
  warnings: [{ severity: 'TIP', message: 'insight' }],
  steps: [{ step: 1, description: 'Allowable shear stress', result: '240.00' }]
};

describe('weld-pdf-builder', () => {
  it('includes title and hero', () => {
    const lines = buildWeldReportLines(input);
    expect(lines[0]!.style).toBe('title');
    expect(lines.some((l) => l.style === 'hero' && l.text.includes('6.00'))).toBe(true);
  });
  it('includes metrics in the note line', () => {
    const lines = buildWeldReportLines(input);
    expect(lines.some((l) => l.text.includes('utilization 0.612'))).toBe(true);
  });
  it('includes warnings when present', () => {
    const lines = buildWeldReportLines(input);
    expect(lines.some((l) => l.text.includes('[TIP] insight'))).toBe(true);
  });
  it('includes steps', () => {
    const lines = buildWeldReportLines(input);
    expect(lines.some((l) => l.text.includes('1. Allowable shear stress = 240.00'))).toBe(true);
  });
});
