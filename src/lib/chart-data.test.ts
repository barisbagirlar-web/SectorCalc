import { describe, it, expect } from 'vitest';
import { buildDoughnutData, buildSensitivityBar, doughnutColors } from './chart-data.js';

describe('chart-data', () => {
  it('doughnut slices sum to 100 (conservation)', () => {
    const d = buildDoughnutData([
      { item: 'A', pct: '50.0' }, { item: 'B', pct: '30.0' }, { item: 'C', pct: '20.0' }
    ]);
    const sum = d.values.reduce((a, v) => a + v, 0);
    expect(Math.abs(sum - 100) < 0.2).toBe(true);
    expect(d.labels.length).toBe(3);
  });

  it('re-normalizes when pcts do not sum to 100', () => {
    const d = buildDoughnutData([{ item: 'A', pct: '10' }, { item: 'B', pct: '10' }]);
    const sum = d.values.reduce((a, v) => a + v, 0);
    expect(Math.abs(sum - 100) < 0.2).toBe(true);
  });

  it('empty breakdown yields empty arrays', () => {
    const d = buildDoughnutData([]);
    expect(d.values.length).toBe(0);
  });

  it('palette wraps', () => {
    expect(doughnutColors(12).length).toBe(12);
  });

  it('sensitivity bar maps points', () => {
    const b = buildSensitivityBar([{ net: 1000, cost: 1500 }, { net: 2000, cost: 3000 }]);
    expect(b.labels).toEqual(['1000', '2000']);
    expect(b.values[1]).toBe(3000);
  });
});
