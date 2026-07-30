import type { CreditPackageKey } from '../domain/packages';
import {
  CREDIT_PACKAGES,
  INVALID_PADDLE_PRICE_IDS,
  assertNoInvalidPriceMapping
} from '../domain/packages';

export type PaddleEnv = 'sandbox' | 'production';

export function getPaddleEnv(): PaddleEnv {
  const env = (process.env.PADDLE_ENV || '').trim().toLowerCase();
  if (env !== 'sandbox' && env !== 'production') {
    throw new Error(
      `PADDLE_CONFIGURATION_ERROR: PADDLE_ENV must be "sandbox" or "production", got "${env}"`
    );
  }
  const apiKey = (process.env.PADDLE_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('PADDLE_CONFIGURATION_ERROR: PADDLE_API_KEY is empty');
  }
  if (env === 'production' && !apiKey.startsWith('pdl_live_apikey_')) {
    throw new Error(
      'PADDLE_CONFIGURATION_ERROR: production environment requires pdl_live_apikey_ prefix'
    );
  }
  if (env === 'sandbox' && !apiKey.startsWith('pdl_sdbx_apikey_')) {
    throw new Error(
      'PADDLE_CONFIGURATION_ERROR: sandbox environment requires pdl_sdbx_apikey_ prefix'
    );
  }
  return env as PaddleEnv;
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
