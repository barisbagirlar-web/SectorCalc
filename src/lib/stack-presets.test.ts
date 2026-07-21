import { describe, it, expect } from 'vitest';
import { PRESETS } from './stack-presets.js';

describe('stack-presets', () => {
  it('has 3 presets', () => { expect(PRESETS.length).toBe(3); });
  it('general uses loose tolerances', () => {
    const g = PRESETS.find((p) => p.id === 'general')!;
    expect(g.components[0]!.tol).toBe('0.2');
  });
  it('automotive is tighter with Cpk 1.33', () => {
    const a = PRESETS.find((p) => p.id === 'automotive')!;
    expect(a.components[0]!.tol).toBe('0.05');
    expect(a.components[0]!.cpk).toBe('1.33');
  });
  it('aerospace is tightest with Cpk 1.67', () => {
    const a = PRESETS.find((p) => p.id === 'aerospace')!;
    expect(a.components[0]!.tol).toBe('0.02');
    expect(a.components[0]!.cpk).toBe('1.67');
  });
});
