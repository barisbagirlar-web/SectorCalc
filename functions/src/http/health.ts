import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { getPaddleEnv, getPriceMap, monetizationEnabled } from '../lib/config';

export async function handleHealth(
  _req: Request,
  res: Response,
  opts?: { reconciliationSchedulerDeployed?: boolean }
): Promise<void> {
  const schedulerDeployed = opts?.reconciliationSchedulerDeployed === true;
  let paddleEnv: string = 'unknown';
  let envMatch = false;
  try {
    paddleEnv = getPaddleEnv();
    envMatch = true;
  } catch {
    paddleEnv = (process.env.PADDLE_ENV || 'unknown').toLowerCase();
  }

  const apiKey = (process.env.PADDLE_API_KEY || '').trim();
  const webhookSecret = (process.env.PADDLE_WEBHOOK_SECRET || '').trim();
  let priceCatalogConfigured = false;
  try {
    getPriceMap();
    priceCatalogConfigured = true;
  } catch {
    priceCatalogConfigured = false;
  }

  res.status(200).json({
    ok: true,
    service: 'sectorcalc-billing',
    paddleEnv,
    creditMonetizationEnabled: monetizationEnabled(),
    apiKeyConfigured: apiKey.length > 0,
    apiKeyEnvironmentMatch: envMatch,
    webhookSecretConfigured: webhookSecret.length > 0,
    priceCatalogConfigured,
    reconciliationSchedulerMissing: !schedulerDeployed,
    RECONCILIATION_SCHEDULER_MISSING: schedulerDeployed ? 'NO' : 'YES',
    reconciliationSchedule: schedulerDeployed ? 'every 15 minutes' : null
  });
}
