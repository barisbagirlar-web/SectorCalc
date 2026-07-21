import { describe, it, expect } from 'vitest';
import { buildQuoteReportLines } from './quote-pdf-builder.js';

const input = {
  toolCode: 'SC-012', sellPrice: '6250.00', unitPrice: '625.00', totalCost: '5000.00',
  profit: '1250.00', currency: 'USD',
  breakdown: [{ item: 'Effective material (scrap incl.)', amount: '1111.11', pct: '22.2' }],
  warnings: [{ severity: 'TIP', message: 'insight' }],
  steps: [{ step: 1, description: 'Material cost with scrap', result: '1111.11' }]
};

describe('quote-pdf-builder', () => {
  it('includes title and hero', () => {
    const lines = buildQuoteReportLines(input);
    expect(lines[0]!.style).toBe('title');
    expect(lines.some((l) => l.style === 'hero' && l.text.includes('6250.00'))).toBe(true);
  });
  it('includes every breakdown row', () => {
    const lines = buildQuoteReportLines(input);
    expect(lines.some((l) => l.text.includes('Effective material (scrap incl.)'))).toBe(true);
  });
  it('includes warnings when present', () => {
    const lines = buildQuoteReportLines(input);
    expect(lines.some((l) => l.text.includes('[TIP] insight'))).toBe(true);
  });
  it('includes steps', () => {
    const lines = buildQuoteReportLines(input);
    expect(lines.some((l) => l.text.includes('1. Material cost with scrap = 1111.11'))).toBe(true);
  });
});
