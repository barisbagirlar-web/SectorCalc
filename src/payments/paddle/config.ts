/**
 * Paddle sandbox configuration for SectorCalc test payments.
 * Secrets stay in env — never ship API keys in the browser bundle.
 */
import { PACKAGES, PADDLE_SANDBOX_PRICE_IDS, type CreditPackage } from '../../billing/credit-packages.js';

export type PaddleEnvironment = 'sandbox' | 'production';

export interface PaddlePublicConfig {
  environment: PaddleEnvironment;
  /** Client-side token for Paddle.js (safe to expose). Empty until set. */
  clientToken: string;
  packages: CreditPackage[];
}

export { PADDLE_SANDBOX_PRICE_IDS };

function viteEnv(name: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const value = env?.[name];
  return typeof value === 'string' ? value : '';
}

export function getPaddlePublicConfig(): PaddlePublicConfig {
  const raw = (viteEnv('VITE_PADDLE_ENV') || 'sandbox').toLowerCase();
  const environment: PaddleEnvironment = raw === 'production' ? 'production' : 'sandbox';
  return {
    environment,
    clientToken: viteEnv('VITE_PADDLE_CLIENT_TOKEN'),
    packages: PACKAGES
  };
}

export function resolveSandboxPriceId(credits: 20 | 100 | 300 | 1000): string {
  const pack = PACKAGES.find((p) => p.credits === credits);
  if (!pack) throw new Error(`Unknown credit pack: ${credits}`);
  return pack.paddlePriceId;
}
