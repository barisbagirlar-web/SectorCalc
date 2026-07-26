import { describe, it, expect } from 'vitest';
import {
  PADDLE_SANDBOX_PRICE_IDS,
  getPaddlePublicConfig,
  resolveSandboxPriceId
} from './config.js';
import { PACKAGES } from '../../lib/pricing-packages.js';

describe('paddle sandbox config', () => {
  it('defaults to sandbox', () => {
    const cfg = getPaddlePublicConfig();
    expect(cfg.environment).toBe('sandbox');
    expect(cfg.packages).toBe(PACKAGES);
  });

  it('exposes Sectorcalc10 sandbox price IDs', () => {
    expect(PADDLE_SANDBOX_PRICE_IDS.tryOnce).toBe('pri_01kvv1wpnq508nkg37f9vy0aqy');
    expect(PADDLE_SANDBOX_PRICE_IDS.bestValue).toBe('pri_01kvv28x31xas1q8pdrqqa4hr7');
    expect(resolveSandboxPriceId(15)).toBe(PADDLE_SANDBOX_PRICE_IDS.popular);
    expect(resolveSandboxPriceId(1)).toBe(PADDLE_SANDBOX_PRICE_IDS.tryOnce);
  });
});
