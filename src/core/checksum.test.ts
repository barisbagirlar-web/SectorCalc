import { describe, it, expect } from 'vitest';
import { calculationChecksum } from './checksum.js';

describe('checksum', () => {
  it('same inputs produce the same stamp', async () => {
    const a = await calculationChecksum('SC-000', '1.0.0', { x: 1, y: 2 }, '3');
    const b = await calculationChecksum('SC-000', '1.0.0', { y: 2, x: 1 }, '3'); // different order
    expect(a).toBe(b); // sorting normalizes order
  });

  it('different results produce different stamps', async () => {
    const a = await calculationChecksum('SC-000', '1.0.0', { x: 1 }, '3');
    const b = await calculationChecksum('SC-000', '1.0.0', { x: 1 }, '4');
    expect(a).not.toBe(b);
  });

  it('normalizes nested arrays and primitives in inputs', async () => {
    const a = await calculationChecksum('SC-000', '1.0.0', { arr: [3, 1, 2], n: 5 }, '9');
    const b = await calculationChecksum('SC-000', '1.0.0', { n: 5, arr: [3, 1, 2] }, '9');
    expect(a).toBe(b);
  });
});
