import type { CreditPackageKey } from '../domain/packages';
import {
  CREDIT_PACKAGES,
  INVALID_PADDLE_PRICE_IDS,
  assertNoInvalidPriceMapping
} from '../domain/packages';

export type PaddleEnv = 'sandbox' | 'production';

export function getPaddleEnv(): PaddleEnv {
  const env = (process.env.PADDLE_ENV || 'sandbox').trim();
  if (env !== 'sandbox' && env !== 'production') {
    throw new Error('PADDLE_CONFIGURATION_ERROR: PADDLE_ENV must be sandbox|production');
  }
  return env as PaddleEnv;
}

export function getPriceMap(): Record<CreditPackageKey, string> {
  const map = {
    STARTER: (process.env.PADDLE_PRICE_STARTER || 'pri_01kyhfb5q0jxrck07py0xxaqw7').trim(),
    WORKSHOP: (process.env.PADDLE_PRICE_WORKSHOP || 'pri_01kyhfczs0aaj62smrthvc3my8').trim(),
    PROFESSIONAL: (
      process.env.PADDLE_PRICE_PROFESSIONAL || 'pri_01kyhff4xx34m229w6ytpjpefs'
    ).trim(),
    TEAM_WALLET: (process.env.PADDLE_PRICE_TEAM_WALLET || 'pri_01kyhfgk3ax50gz1m7zh877w9c').trim()
  };
  const errs = assertNoInvalidPriceMapping(map);
  if (errs.length) {
    throw new Error(`PADDLE_CONFIGURATION_ERROR: ${errs.join('; ')}`);
  }
  return map as Record<CreditPackageKey, string>;
}

export function resolvePackage(packageKey: CreditPackageKey): {
  key: CreditPackageKey;
  credits: number;
  priceId: string;
} {
  const def = CREDIT_PACKAGES[packageKey];
  const priceId = getPriceMap()[packageKey];
  if ((INVALID_PADDLE_PRICE_IDS as readonly string[]).includes(priceId)) {
    throw new Error('PADDLE_CONFIGURATION_ERROR: INVALID price ID');
  }
  return { key: packageKey, credits: def.credits, priceId };
}

export function monetizationEnabled(): boolean {
  const val = process.env.CREDIT_MONETIZATION_ENABLED;
  if (val === undefined || val === '') return true;
  return String(val).toLowerCase() === 'true';
}

export function apiBaseForEnv(env: PaddleEnv): string {
  return env === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';
}
