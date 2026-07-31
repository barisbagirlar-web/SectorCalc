import { randomUUID } from 'node:crypto';
import { getPaddleEnv, apiBaseForEnv } from './config';
import { CREDIT_PACKAGES, type CreditPackageKey } from '../domain/packages';

export function newCorrelationId(): string {
  return randomUUID();
}

/**
 * Structured Paddle API error. Preserves real Paddle error.code / detail /
 * request_id so callers can log them and surface a safe subset to the browser.
 * Never carries API keys, customer data, or the raw Paddle error detail to clients.
 */
export class PaddleApiError extends Error {
  readonly operation: string;
  readonly httpStatus: number;
  readonly paddleType?: string;
  readonly paddleCode?: string;
  readonly paddleDetail?: string;
  readonly documentationUrl?: string;
  readonly requestId?: string;
  readonly correlationId: string;

  constructor(fields: {
    operation: string;
    httpStatus: number;
    correlationId: string;
    paddleType?: string;
    paddleCode?: string;
    paddleDetail?: string;
    documentationUrl?: string;
    requestId?: string;
  }) {
    const code = fields.paddleCode
      ? `PADDLE_${fields.paddleCode}`
      : `PADDLE_HTTP_${fields.httpStatus}`;
    super(code);
    this.name = 'PaddleApiError';
    this.operation = fields.operation;
    this.httpStatus = fields.httpStatus;
    this.paddleType = fields.paddleType;
    this.paddleCode = fields.paddleCode;
    this.paddleDetail = fields.paddleDetail;
    this.documentationUrl = fields.documentationUrl;
    this.requestId = fields.requestId;
    this.correlationId = fields.correlationId;
  }
}

export function isPaddleApiError(err: unknown): err is PaddleApiError {
  return err instanceof PaddleApiError;
}

/** Safe payload for the browser — never includes raw Paddle detail or secrets. */
export interface CheckoutFailurePayload {
  error: 'PADDLE_CHECKOUT_FAILED';
  code?: string;
  requestId?: string;
  correlationId: string;
}

export function toCheckoutFailurePayload(err: unknown): CheckoutFailurePayload | null {
  if (isPaddleApiError(err)) {
    return {
      error: 'PADDLE_CHECKOUT_FAILED',
      code: err.paddleCode,
      requestId: err.requestId,
      correlationId: err.correlationId
    };
  }
  return null;
}

export interface PaddleErrorContext {
  operation: string;
  priceId?: string;
  packageKey?: string;
  purchaseId?: string;
}

interface PaddleErrorBody {
  error?: {
    type?: unknown;
    code?: unknown;
    detail?: unknown;
    documentation_url?: unknown;
  };
  meta?: { request_id?: unknown };
}

function parsePaddleErrorBody(json: PaddleErrorBody): {
  paddleType?: string;
  paddleCode?: string;
  paddleDetail?: string;
  documentationUrl?: string;
  requestId?: string;
} {
  const err = json?.error || {};
  const meta = json?.meta || {};
  const requestId = typeof meta.request_id === 'string' ? meta.request_id : undefined;
  return {
    paddleType: typeof err.type === 'string' ? err.type : undefined,
    paddleCode: typeof err.code === 'string' ? err.code : undefined,
    paddleDetail: typeof err.detail === 'string' ? err.detail : undefined,
    documentationUrl: typeof err.documentation_url === 'string' ? err.documentation_url : undefined,
    requestId
  };
}

function logPaddleFailure(params: {
  ctx: PaddleErrorContext;
  httpStatus: number;
  paddleCode?: string;
  paddleDetail?: string;
  paddleRequestId?: string;
  environment: string;
  correlationId: string;
}): void {
  const { ctx, httpStatus, paddleCode, paddleDetail, paddleRequestId, environment, correlationId } =
    params;
  console.error('paddle_api_failure', {
    event: 'paddle_api_failure',
    operation: ctx.operation,
    httpStatus,
    paddleCode: paddleCode || undefined,
    paddleDetail: paddleDetail || undefined,
    paddleRequestId: paddleRequestId || undefined,
    priceId: ctx.priceId || undefined,
    packageKey: ctx.packageKey || undefined,
    purchaseId: ctx.purchaseId || undefined,
    environment,
    correlationId
  });
}

/** Raw Paddle fetch. Throws PaddleApiError on non-2xx (parsed, not logged). */
export async function paddleFetch(
  path: string,
  init: RequestInit = {},
  operation: string,
  correlationId?: string
): Promise<Response> {
  const key = process.env.PADDLE_API_KEY || '';
  const cid = correlationId || newCorrelationId();
  if (!key) {
    throw new PaddleApiError({
      operation,
      httpStatus: 503,
      correlationId: cid,
      paddleCode: 'API_KEY_MISSING'
    });
  }
  const env = getPaddleEnv();
  const url = `${apiBaseForEnv(env)}${path}`;
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${key}`);
  headers.set('Paddle-Version', '1');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (cause) {
    throw new PaddleApiError({
      operation,
      httpStatus: 502,
      correlationId: cid,
      paddleCode: 'NETWORK_ERROR',
      paddleDetail: cause instanceof Error ? cause.message : undefined
    });
  }
  if (!res.ok) {
    let json: PaddleErrorBody = {};
    try {
      json = (await res.json()) as PaddleErrorBody;
    } catch {
      json = {};
    }
    const parsed = parsePaddleErrorBody(json);
    throw new PaddleApiError({
      operation,
      httpStatus: res.status,
      correlationId: cid,
      paddleType: parsed.paddleType,
      paddleCode: parsed.paddleCode,
      paddleDetail: parsed.paddleDetail,
      documentationUrl: parsed.documentationUrl,
      requestId: parsed.requestId
    });
  }
  return res;
}

export async function createPaddleTransaction(input: {
  priceId: string;
  purchaseId: string;
  packageKey: CreditPackageKey;
  userId: string;
  correlationId?: string;
}): Promise<{ id: string }> {
  const correlationId = input.correlationId || newCorrelationId();
  const ctx: PaddleErrorContext = {
    operation: 'create_transaction',
    priceId: input.priceId,
    packageKey: input.packageKey,
    purchaseId: input.purchaseId
  };
  const env = getPaddleEnv();

  const body = {
    items: [{ price_id: input.priceId, quantity: 1 }],
    custom_data: {
      sectorcalc_purchase_id: input.purchaseId,
      sectorcalc_package_key: input.packageKey,
      sectorcalc_user_id: input.userId
    },
    enable_checkout: true
  };

  let res: Response;
  try {
    res = await paddleFetch(
      '/transactions',
      { method: 'POST', body: JSON.stringify(body) },
      'create_transaction',
      correlationId
    );
  } catch (err) {
    if (isPaddleApiError(err)) {
      logPaddleFailure({
        ctx,
        httpStatus: err.httpStatus,
        paddleCode: err.paddleCode,
        paddleDetail: err.paddleDetail,
        paddleRequestId: err.requestId,
        environment: env,
        correlationId: err.correlationId
      });
      throw err;
    }
    logPaddleFailure({
      ctx,
      httpStatus: 0,
      paddleCode: 'UNEXPECTED_ERROR',
      paddleDetail: err instanceof Error ? err.message : undefined,
      environment: env,
      correlationId
    });
    throw new PaddleApiError({
      operation: 'create_transaction',
      httpStatus: 502,
      correlationId,
      paddleCode: 'UNEXPECTED_ERROR'
    });
  }

  let json: { data?: { id?: string } };
  try {
    json = (await res.json()) as { data?: { id?: string } };
  } catch {
    logPaddleFailure({
      ctx,
      httpStatus: 0,
      paddleCode: 'INVALID_JSON',
      paddleDetail: 'transaction response body was not valid JSON',
      environment: env,
      correlationId
    });
    throw new PaddleApiError({
      operation: 'create_transaction',
      httpStatus: 502,
      correlationId,
      paddleCode: 'INVALID_JSON'
    });
  }
  if (!json.data?.id) {
    logPaddleFailure({
      ctx,
      httpStatus: res.status,
      paddleCode: 'MISSING_TRANSACTION_ID',
      paddleDetail: 'transaction created without an id',
      environment: env,
      correlationId
    });
    throw new PaddleApiError({
      operation: 'create_transaction',
      httpStatus: 502,
      correlationId,
      paddleCode: 'MISSING_TRANSACTION_ID'
    });
  }
  return { id: json.data.id };
}

export async function getPaddleTransaction(
  transactionId: string,
  correlationId?: string
): Promise<Record<string, unknown>> {
  const cid = correlationId || newCorrelationId();
  const ctx: PaddleErrorContext = { operation: 'get_transaction' };
  const env = getPaddleEnv();
  let json: { data?: Record<string, unknown> };
  try {
    const res = await paddleFetch(`/transactions/${transactionId}`, {}, 'get_transaction', cid);
    try {
      json = (await res.json()) as { data?: Record<string, unknown> };
    } catch {
      throw new PaddleApiError({
        operation: 'get_transaction',
        httpStatus: 502,
        correlationId: cid,
        paddleCode: 'INVALID_JSON'
      });
    }
  } catch (err) {
    if (isPaddleApiError(err)) {
      logPaddleFailure({
        ctx,
        httpStatus: err.httpStatus,
        paddleCode: err.paddleCode,
        paddleDetail: err.paddleDetail,
        paddleRequestId: err.requestId,
        environment: env,
        correlationId: err.correlationId
      });
      throw err;
    }
    throw err;
  }
  if (!json.data) {
    throw new Error(`Paddle transaction fetch failed: missing data for ${transactionId}`);
  }
  return json.data;
}

export interface PaddlePriceCheck {
  key: CreditPackageKey;
  priceId: string;
  ok: boolean;
  status?: string;
  amountMinor?: string;
  currencyCode?: string;
  billingCycle?: unknown;
  quantity?: unknown;
  productId?: string;
  errorCode?: string;
  httpStatus?: number;
}

/** Expected credit/minor-unit invariants from the server SSOT. */
const EXPECTED_PRICE_INVARIANTS: Record<
  Exclude<CreditPackageKey, 'TEST_1000'>,
  { credits: number; minor: string }
> = {
  STARTER: {
    credits: CREDIT_PACKAGES.STARTER.credits,
    minor: CREDIT_PACKAGES.STARTER.expectedMinorUnits
  },
  WORKSHOP: {
    credits: CREDIT_PACKAGES.WORKSHOP.credits,
    minor: CREDIT_PACKAGES.WORKSHOP.expectedMinorUnits
  },
  PROFESSIONAL: {
    credits: CREDIT_PACKAGES.PROFESSIONAL.credits,
    minor: CREDIT_PACKAGES.PROFESSIONAL.expectedMinorUnits
  },
  TEAM_WALLET: {
    credits: CREDIT_PACKAGES.TEAM_WALLET.credits,
    minor: CREDIT_PACKAGES.TEAM_WALLET.expectedMinorUnits
  }
};

/**
 * Live Paddle price verification (readiness + release gate).
 * Verifies real entity existence via the API — format checks are not enough.
 */
export async function verifyPaddlePrices(priceMap: Record<CreditPackageKey, string>): Promise<{
  ok: boolean;
  checks: PaddlePriceCheck[];
}> {
  const env = getPaddleEnv();
  const checks: PaddlePriceCheck[] = [];
  for (const key of Object.keys(EXPECTED_PRICE_INVARIANTS) as Array<
    keyof typeof EXPECTED_PRICE_INVARIANTS
  >) {
    const priceId = priceMap[key];
    const invariant = EXPECTED_PRICE_INVARIANTS[key];
    const check: PaddlePriceCheck = { key, priceId, ok: false };
    try {
      const res = await paddleFetch(`/prices/${priceId}`, {}, 'verify_price');
      let json: { data?: Record<string, unknown> };
      try {
        json = (await res.json()) as { data?: Record<string, unknown> };
      } catch {
        check.errorCode = 'INVALID_JSON';
        check.httpStatus = 0;
        checks.push(check);
        continue;
      }
      const data = json.data || {};
      const unit = (data.unit_price || {}) as { amount?: string | number; currency_code?: string };
      const quantity = data.quantity as { minimum?: number; maximum?: number } | undefined;
      check.status = typeof data.status === 'string' ? data.status : undefined;
      check.amountMinor = String(unit.amount ?? '');
      check.currencyCode = typeof unit.currency_code === 'string' ? unit.currency_code : undefined;
      check.billingCycle = data.billing_cycle;
      check.quantity = quantity;
      check.productId = typeof data.product_id === 'string' ? data.product_id : undefined;

      const failures: string[] = [];
      if (data.status !== 'active') failures.push(`status=${data.status}`);
      if (String(unit.amount ?? '') !== invariant.minor) {
        failures.push(`amount=${unit.amount} != ${invariant.minor}`);
      }
      if (unit.currency_code !== 'USD') failures.push(`currency=${unit.currency_code}`);
      if (data.billing_cycle !== null) failures.push('billing_cycle must be null (one-time)');
      if (quantity && (quantity.minimum !== 1 || quantity.maximum !== 1)) {
        failures.push(`quantity must be 1..1 (got ${JSON.stringify(quantity)})`);
      }
      check.ok = failures.length === 0;
      if (!check.ok) check.errorCode = failures.join('; ');
    } catch (err) {
      if (isPaddleApiError(err)) {
        check.httpStatus = err.httpStatus;
        check.errorCode = err.paddleCode || undefined;
      } else {
        check.httpStatus = 0;
        check.errorCode = err instanceof Error ? err.message : 'UNKNOWN';
      }
      logPaddleFailure({
        ctx: { operation: 'verify_price', priceId, packageKey: key },
        httpStatus: check.httpStatus || 0,
        paddleCode: check.errorCode,
        environment: env,
        correlationId: newCorrelationId()
      });
    }
    checks.push(check);
  }
  return { ok: checks.every((c) => c.ok), checks };
}
