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
  const raw = (viteEnv('VITE_PADDLE_ENV') || '').toLowerCase();
  if (raw !== 'sandbox' && raw !== 'production') {
    // Prefer explicit env; fall back sandbox for local only when token present.
    const environment: PaddleEnvironment = 'sandbox';
    return {
      environment,
      clientToken: viteEnv('VITE_PADDLE_CLIENT_TOKEN'),
      packages: PACKAGES
    };
  }
  return {
    environment: raw,
    clientToken: viteEnv('VITE_PADDLE_CLIENT_TOKEN'),
    packages: PACKAGES
  };
}
