/**
 * Paddle sandbox configuration for SectorCalc test payments.
 * Secrets stay in env — never ship API keys in the browser bundle.
 */
import { PACKAGES, type CreditPackage } from '../../lib/pricing-packages.js';

export type PaddleEnvironment = 'sandbox' | 'production';

export interface PaddlePublicConfig {
  environment: PaddleEnvironment;
  /** Client-side token for Paddle.js (safe to expose). Empty until set. */
  clientToken: string;
  packages: CreditPackage[];
}

/** Sandbox catalog price IDs (Sectorcalc10 test). */
export const PADDLE_SANDBOX_PRICE_IDS = {
  tryOnce: 'pri_01kvv1wpnq508nkg37f9vy0aqy',
  essentials: 'pri_01kvv20wppf64fht2tn82wq8wc',
  popular: 'pri_01kvv24222vst09fyh7rxv3ck8',
  teams: 'pri_01kvv27axkgbd5ddmd9c6gaaj9',
  bestValue: 'pri_01kvv28x31xas1q8pdrqqa4hr7'
} as const;

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

export function resolveSandboxPriceId(credits: 1 | 5 | 15 | 30 | 100): string {
  const pack = PACKAGES.find((p) => p.credits === credits);
  if (!pack) throw new Error(`Unknown credit pack: ${credits}`);
  return pack.paddlePriceId;
}
