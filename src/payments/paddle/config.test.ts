import { describe, it, expect } from 'vitest';
import {
  PADDLE_SANDBOX_PRICE_IDS,
  getPaddlePublicConfig,
  resolveSandboxPriceId
} from './config.js';
import { PACKAGES } from '../../billing/credit-packages.js';

describe('paddle sandbox config', () => {
  it('defaults to sandbox', () => {
    const cfg = getPaddlePublicConfig();
    expect(cfg.environment).toBe('sandbox');
    expect(cfg.packages).toBe(PACKAGES);
  });

  it('exposes credit-pack sandbox price IDs', () => {
    expect(PADDLE_SANDBOX_PRICE_IDS.starter).toBe('pri_01kyhfb5q0jxrck07py0xxaqw7');
    expect(PADDLE_SANDBOX_PRICE_IDS.teamWallet).toBe('pri_01kyhfgk3ax50gz1m7zh877w9c');
    expect(resolveSandboxPriceId(100)).toBe(PADDLE_SANDBOX_PRICE_IDS.workshop);
    expect(resolveSandboxPriceId(20)).toBe(PADDLE_SANDBOX_PRICE_IDS.starter);
  });
});
