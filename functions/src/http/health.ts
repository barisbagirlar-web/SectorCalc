import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { getPaddleEnv, getPriceMap, monetizationEnabled } from '../lib/config';
import { isPaddleApiError, paddleFetch, verifyPaddlePrices } from '../lib/paddle';

export interface ReadinessResult {
  ok: boolean;
  checks: Record<string, boolean>;
  failed: string[];
  priceChecks?: Array<{ key: string; ok: boolean; detail?: string }>;
}

/**
 * Liveness: process is running. No external calls.
 */
export async function handleHealth(
  _req: Request,
  res: Response,
  _opts?: { reconciliationSchedulerDeployed?: boolean }
): Promise<void> {
  res.status(200).json({
    ok: true,
    service: 'sectorcalc-billing',
    uptimeSeconds: Math.round(process.uptime())
  });
}

/**
 * Readiness: live Paddle authentication + price verification.
 * Never writes secrets or raw Paddle error detail into the response.
 */
export async function handleReadiness(
  _req: Request,
  res: Response,
  opts?: { reconciliationSchedulerDeployed?: boolean }
): Promise<void> {
  const result: ReadinessResult = { ok: true, checks: {}, failed: [] };

  // 1. PADDLE_ENV must be production
  let paddleEnv = 'unknown';
  try {
    paddleEnv = getPaddleEnv();
    result.checks.paddleEnv = paddleEnv === 'production';
  } catch {
    paddleEnv = (process.env.PADDLE_ENV || 'unknown').toLowerCase();
    result.checks.paddleEnv = false;
  }
  if (!result.checks.paddleEnv) result.failed.push('paddleEnv');

  // 2. Production key prefix
  const apiKey = (process.env.PADDLE_API_KEY || '').trim();
  result.checks.apiKeyPrefix = apiKey.startsWith('pdl_live_apikey_');
  if (!result.checks.apiKeyPrefix) result.failed.push('apiKeyPrefix');

  // 3. Webhook secret present
  const webhookSecret = (process.env.PADDLE_WEBHOOK_SECRET || '').trim();
  result.checks.webhookSecret = webhookSecret.length > 0;
  if (!result.checks.webhookSecret) result.failed.push('webhookSecret');

  // 4. Scheduler
  const schedulerDeployed = opts?.reconciliationSchedulerDeployed === true;
  result.checks.scheduler = schedulerDeployed;
  if (!schedulerDeployed) result.failed.push('scheduler');

  // 5. Catalog resolves (SSOT + env map)
  let priceMap: Record<string, string> | null = null;
  try {
    priceMap = getPriceMap();
    result.checks.catalog = true;
  } catch {
    result.checks.catalog = false;
    result.failed.push('catalog');
  }
  if (!result.checks.catalog || !priceMap) {
    res.status(503).json({ ...result, ok: false });
    return;
  }
  const resolvedPriceMap = priceMap;

  // 6. Live Paddle auth probe (prices.read) — cheapest authoritative call
  const starterId = resolvedPriceMap['STARTER'];
  let authOk = false;
  try {
    const probe = await paddleFetch(`/prices/${starterId}`, {}, 'readiness_probe');
    authOk = probe.ok;
  } catch (err) {
    authOk = false;
    if (isPaddleApiError(err)) {
      // Keep only the HTTP status class — no secret/detail leakage.
      console.warn('readiness_auth_probe_failed', {
        event: 'readiness_auth_probe_failed',
        httpStatus: err.httpStatus,
        paddleCode: err.paddleCode,
        correlationId: err.correlationId
      });
    }
  }
  result.checks.paddleAuthProbe = authOk;
  if (!authOk) result.failed.push('paddleAuthProbe');

  // 7. Live price verification (all 4 production prices)
  const priceVerification = await verifyPaddlePrices(resolvedPriceMap as Record<string, string>);
  result.priceChecks = priceVerification.checks.map((c) => ({
    key: c.key,
    ok: c.ok,
    detail: c.ok ? undefined : c.errorCode
  }));
  result.checks.prices = priceVerification.ok;
  if (!priceVerification.ok) result.failed.push('prices');

  result.checks.monetization = monetizationEnabled();
  if (!result.checks.monetization) result.failed.push('monetization');

  if (result.failed.length > 0) {
    res.status(503).json({ ...result, ok: false });
    return;
  }
  res.status(200).json(result);
}
