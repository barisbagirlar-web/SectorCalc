import type { CreditPackageKey } from '../domain/packages';
import { CREDIT_PACKAGES, INVALID_PADDLE_PRICE_IDS, assertNoInvalidPriceMapping } from '../domain/packages';

export type PaddleEnv = 'sandbox' | 'production';

export function getPaddleEnv(): PaddleEnv {
  const env = (process.env.PADDLE_ENV || '').trim();
  if (env !== 'sandbox' && env !== 'production') {
    throw new Error('PADDLE_CONFIGURATION_ERROR: PADDLE_ENV must be sandbox|production');
  }
  return env;
}

export function getPriceMap(): Record<CreditPackageKey, string> {
  const map = {
    STARTER: (process.env.PADDLE_PRICE_STARTER || '').trim(),
    WORKSHOP: (process.env.PADDLE_PRICE_WORKSHOP || '').trim(),
    PROFESSIONAL: (process.env.PADDLE_PRICE_PROFESSIONAL || '').trim(),
    TEAM_WALLET: (process.env.PADDLE_PRICE_TEAM_WALLET || '').trim()
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
  return String(process.env.CREDIT_MONETIZATION_ENABLED || '').toLowerCase() === 'true';
}

export function apiBaseForEnv(env: PaddleEnv): string {
  return env === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';
}
