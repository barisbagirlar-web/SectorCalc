import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { StackInput } from '../engine-api/types.js';
import type { WhatIfPoint } from './what-if.js';

vi.mock('../engine-api/client.js', () => ({
  calculateTool: vi.fn(async (_toolId: string, input: StackInput) => {
    const relative = Number(input.components?.[0]?.tol ?? 0.2) / 0.2;
    const cpk = (2 / relative).toFixed(4);
    const ppm = (100 * relative * relative).toFixed(4);
    return { result: { cpk, ppm }, engineVersion: 'test', requestId: 't' };
  })
}));

const { whatIfToleranceScale, WHAT_IF_SCALES } = await import('./what-if.js');

const input: StackInput = {
  components: [
    { name: 'A', nominal: '10', tol: '0.2', distribution: 'normal' },
    { name: 'B', nominal: '20', tol: '0.3', distribution: 'normal' }
  ],
  usl: '31.5',
  lsl: '28.5',
  seed: 1,
  iterations: 500
};

describe('what-if (API-backed)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('returns one point per scale', async () => {
    expect((await whatIfToleranceScale(input)).length).toBe(WHAT_IF_SCALES.length);
  });
  it('tighter tolerance (scale < 1) improves Cpk', async () => {
    const pts = await whatIfToleranceScale(input);
    const tight = pts.find((p: WhatIfPoint) => p.scale === 0.5)!;
    const loose = pts.find((p: WhatIfPoint) => p.scale === 1.5)!;
    expect(Number(tight.cpk)).toBeGreaterThan(Number(loose.cpk));
  });
  it('tighter tolerance does not raise PPM', async () => {
    const pts = await whatIfToleranceScale(input);
    const tight = pts.find((p: WhatIfPoint) => p.scale === 0.5)!;
    const loose = pts.find((p: WhatIfPoint) => p.scale === 1.5)!;
    expect(Number(tight.ppm)).toBeLessThanOrEqual(Number(loose.ppm));
  });
  it('baseline scale 1 yields a positive Cpk', async () => {
    const base = (await whatIfToleranceScale(input)).find((p: WhatIfPoint) => p.scale === 1)!;
    expect(Number(base.cpk)).toBeGreaterThan(0);
  });
});
