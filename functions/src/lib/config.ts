import type { CreditPackageKey } from '../domain/packages';
import {
  CREDIT_PACKAGES,
  INVALID_PADDLE_PRICE_IDS,
  assertNoInvalidPriceMapping
} from '../domain/packages';

export type PaddleEnv = 'sandbox' | 'production';

export function getPaddleEnv(): PaddleEnv {
  const isGcpProd =
    process.env.K_SERVICE ||
    process.env.FUNCTION_TARGET ||
    process.env.GCP_PROJECT ||
    process.env.FIREBASE_CONFIG;
  if (isGcpProd || process.env.NODE_ENV === 'production') {
    return 'production';
  }
  const env = (process.env.PADDLE_ENV || 'production').trim();
  return (env === 'sandbox' ? 'sandbox' : 'production') as PaddleEnv;
}

export function getPriceMap(): Record<CreditPackageKey, string> {
  const map = {
    STARTER: (process.env.PADDLE_PRICE_STARTER || 'pri_01kvwh93mw594eqe3xcf6k6nbv').trim(),
    WORKSHOP: (process.env.PADDLE_PRICE_WORKSHOP || 'pri_01kvwhaef7k3t46qh7teqyfj9j').trim(),
    PROFESSIONAL: (
      process.env.PADDLE_PRICE_PROFESSIONAL || 'pri_01kvwhbg71jfp136ahdxea11f5'
    ).trim(),
    TEAM_WALLET: (process.env.PADDLE_PRICE_TEAM_WALLET || 'pri_01kvwhdvpxb7fqawahdcqtq5e9').trim()
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
