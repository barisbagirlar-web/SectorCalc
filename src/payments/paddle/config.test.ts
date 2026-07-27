import { describe, it, expect } from 'vitest';
import { INVALID_PADDLE_PRICE_IDS, getPaddlePublicConfig } from './config.js';
import { PACKAGES } from '../../lib/pricing-packages.js';

describe('paddle public config', () => {
  it('exposes mandate packages without browser price IDs', () => {
    const cfg = getPaddlePublicConfig();
    expect(cfg.packages).toBe(PACKAGES);
    expect(cfg.packages.every((p) => p.paddlePriceId === '')).toBe(true);
  });

  it('lists INVALID price IDs that must never be mapped', () => {
    expect(INVALID_PADDLE_PRICE_IDS).toHaveLength(4);
    expect(INVALID_PADDLE_PRICE_IDS[0]).toMatch(/^pri_01kyhf/);
  });
});
