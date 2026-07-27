import { describe, it, expect } from 'vitest';
import { INVALID_PADDLE_PRICE_IDS, getPaddlePublicConfig } from './config.js';
import { PACKAGES } from '../../lib/pricing-packages.js';

describe('paddle public config', () => {
  it('exposes mandate packages without browser price IDs', () => {
    const cfg = getPaddlePublicConfig();
    expect(cfg.packages).toBe(PACKAGES);
    expect(cfg.packages.every((p) => p.paddlePriceId === '')).toBe(true);
  });

  it('has empty hard-block list after one-time qty lock', () => {
    expect(INVALID_PADDLE_PRICE_IDS).toEqual([]);
  });
});
