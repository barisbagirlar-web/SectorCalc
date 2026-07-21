import { describe, it, expect } from 'vitest';
import { histogramBins, paretoData, compareData } from './stack-chart-data.js';

describe('stack-chart-data', () => {
  it('histogramBins empty -> []', () => { expect(histogramBins([]).length).toBe(0); });
  it('histogramBins counts all samples', () => {
    const bins = histogramBins([1, 2, 3, 4, 5], 5);
    expect(bins.reduce((a, b) => a + b.count, 0)).toBe(5);
  });
  it('paretoData maps names and pct', () => {
    const d = paretoData([{ name: 'A', pct: '60.0' }, { name: 'B', pct: '40.0' }]);
    expect(d.labels).toEqual(['A', 'B']);
    expect(d.values[0]).toBe(60);
  });
  it('compareData three methods', () => {
    const d = compareData('0.5', '0.36', '0.3');
    expect(d.labels.length).toBe(3);
    expect(d.values).toEqual([0.5, 0.36, 0.3]);
  });
});
