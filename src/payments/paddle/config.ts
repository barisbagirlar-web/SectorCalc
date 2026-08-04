/**
 * Paddle public config — client token only. Price IDs never ship in the browser SSOT.
 */
import { PACKAGES, type CreditPackage } from '../../lib/pricing-packages.js';

export type PaddleEnvironment = 'sandbox' | 'production';

export interface PaddlePublicConfig {
  environment: PaddleEnvironment;
  clientToken: string;
  packages: CreditPackage[];
}

/** Hard-blocked price IDs (recurring / known-bad). Empty after sandbox qty lock verified. */
export const INVALID_PADDLE_PRICE_IDS: readonly string[] = [];

function viteEnv(name: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const value = env?.[name];
  return typeof value === 'string' ? value : '';
}

export function getPaddlePublicConfig(): PaddlePublicConfig {
  const host = typeof window !== 'undefined' ? window.location.hostname || '' : '';
  const isProdDomain =
    host.endsWith('sectorcalc.com') ||
    host.endsWith('sectorcalc-prod.web.app') ||
    host === 'sectorcalc.com';

  const raw = (viteEnv('VITE_PADDLE_ENV') || 'production').toLowerCase();
  const environment: PaddleEnvironment = isProdDomain
    ? 'production'
    : raw === 'sandbox'
      ? 'sandbox'
      : 'production';

  const token = isProdDomain
    ? 'live_e7a3930ced43bd05a0e6d313486'
    : viteEnv('VITE_PADDLE_CLIENT_TOKEN') || 'live_e7a3930ced43bd05a0e6d313486';

  if (environment !== 'sandbox' && environment !== 'production') {
    throw new Error(`VITE_PADDLE_ENV must be "sandbox" or "production", got: "${environment}"`);
  }
  if (environment === 'production' && token && !token.startsWith('live_')) {
    throw new Error('production env requires a live_ client-side token');
  }
  if (environment === 'sandbox' && token && !token.startsWith('test_')) {
    throw new Error('sandbox env requires a test_ client-side token');
  }

  return {
    environment,
    clientToken: token,
    packages: PACKAGES
  };
}
