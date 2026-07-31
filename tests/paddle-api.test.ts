import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPaddleEnv } from '../functions/src/lib/config';
import {
  createPaddleTransaction,
  PaddleApiError,
  toCheckoutFailurePayload,
  verifyPaddlePrices
} from '../functions/src/lib/paddle';

type FetchMock = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

const PRICE_MAP = {
  STARTER: 'pri_01kvwh93mw594eqe3xcf6k6nbv',
  WORKSHOP: 'pri_01kvwhaef7k3t46qh7teqyfj9j',
  PROFESSIONAL: 'pri_01kvwhbg71jfp136ahdxea11f5',
  TEAM_WALLET: 'pri_01kvwhdvpxb7fqawahdcqtq5e9'
} as const;

// Short synthetic keys: prefix validation only — must not match the
// production guard's `pdl_(live|sdbx)_apikey_[A-Za-z0-9_-]{20,}` literal pattern.
const LIVE_TEST_KEY = 'pdl_live_apikey_aaaa';
const SANDBOX_TEST_KEY = 'pdl_sdbx_apikey_bbbb';

const ACTIVE_PRICE = {
  status: 'active',
  billing_cycle: null,
  trial_period: null,
  quantity: { minimum: 1, maximum: 1 },
  unit_price: { amount: '1500', currency_code: 'USD' },
  product_id: 'pro_01'
};

describe('createPaddleTransaction', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.PADDLE_ENV = 'production';
    process.env.PADDLE_API_KEY = LIVE_TEST_KEY;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  it('creates a checkout transaction with required body fields', async () => {
    const mock = vi.fn<FetchMock>(async () => jsonResponse({ data: { id: 'txn_123' } }, 201));
    vi.stubGlobal('fetch', mock);

    const result = await createPaddleTransaction({
      priceId: PRICE_MAP.STARTER,
      purchaseId: 'pur_123',
      packageKey: 'STARTER',
      userId: 'uid_42'
    });

    expect(result.id).toBe('txn_123');
    const called = mock.mock.calls[0]!;
    expect(String(called[0])).toBe('https://api.paddle.com/transactions');
    const body = JSON.parse(String((called[1] as RequestInit).body));
    expect(body.items).toEqual([{ price_id: PRICE_MAP.STARTER, quantity: 1 }]);
    expect(body.enable_checkout).toBe(true);
    expect(body.custom_data).toEqual({
      sectorcalc_purchase_id: 'pur_123',
      sectorcalc_package_key: 'STARTER',
      sectorcalc_user_id: 'uid_42'
    });
    expect(body.customer).toBeUndefined();
  });

  it.each([
    [400, 'invalid_operation', 'request_error'],
    [401, 'authentication_failed', 'authentication_error'],
    [403, 'permission_denied', 'authorization_error'],
    [404, 'not_found', 'request_error']
  ])('preserves Paddle %s error code/type/request_id', async (status, code, type) => {
    const mock = vi.fn<FetchMock>(async () =>
      jsonResponse(
        {
          error: { type, code, detail: 'Human readable detail' },
          meta: { request_id: 'req_xyz' }
        },
        status
      )
    );
    vi.stubGlobal('fetch', mock);

    const correlationId = 'corr_abc';
    await expect(
      createPaddleTransaction({
        priceId: PRICE_MAP.STARTER,
        purchaseId: 'pur_1',
        packageKey: 'STARTER',
        userId: 'uid_1',
        correlationId
      })
    ).rejects.toMatchObject({
      name: 'PaddleApiError',
      httpStatus: status,
      paddleCode: code,
      paddleType: type,
      requestId: 'req_xyz',
      correlationId
    });

    const log = vi.mocked(console.error).mock.calls.find((c) => c[0] === 'paddle_api_failure')!;
    const payload = log[1] as Record<string, unknown>;
    expect(payload.event).toBe('paddle_api_failure');
    expect(payload.operation).toBe('create_transaction');
    expect(payload.httpStatus).toBe(status);
    expect(payload.paddleCode).toBe(code);
    expect(payload.paddleRequestId).toBe('req_xyz');
    expect(payload.purchaseId).toBe('pur_1');
    expect(payload.priceId).toBe(PRICE_MAP.STARTER);
    expect(payload.packageKey).toBe('STARTER');
    expect(JSON.stringify(payload)).not.toContain('pdl_live_apikey_');
    expect(JSON.stringify(payload)).not.toContain('uid_1');
  });

  it('maps network timeout to NETWORK_ERROR with correlationId', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async () => {
        throw new TypeError('fetch failed: network unreachable');
      })
    );
    const err = await createPaddleTransaction({
      priceId: PRICE_MAP.STARTER,
      purchaseId: 'pur_1',
      packageKey: 'STARTER',
      userId: 'uid_1'
    }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(PaddleApiError);
    expect((err as PaddleApiError).paddleCode).toBe('NETWORK_ERROR');
    expect((err as PaddleApiError).httpStatus).toBe(502);
    expect((err as PaddleApiError).correlationId).toBeTruthy();
  });

  it('maps invalid JSON success response to INVALID_JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async () => new Response('<html>bad gateway</html>', { status: 201 }))
    );
    const err = await createPaddleTransaction({
      priceId: PRICE_MAP.STARTER,
      purchaseId: 'pur_1',
      packageKey: 'STARTER',
      userId: 'uid_1'
    }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(PaddleApiError);
    expect((err as PaddleApiError).paddleCode).toBe('INVALID_JSON');
  });

  it('maps 2xx without data.id to MISSING_TRANSACTION_ID', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async () => jsonResponse({ data: {} }, 201))
    );
    const err = await createPaddleTransaction({
      priceId: PRICE_MAP.STARTER,
      purchaseId: 'pur_1',
      packageKey: 'STARTER',
      userId: 'uid_1'
    }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(PaddleApiError);
    expect((err as PaddleApiError).paddleCode).toBe('MISSING_TRANSACTION_ID');
  });

  it('toCheckoutFailurePayload exposes only safe fields', async () => {
    const err = new PaddleApiError({
      operation: 'create_transaction',
      httpStatus: 403,
      correlationId: 'corr_1',
      paddleCode: 'permission_denied',
      paddleDetail: 'SENSITIVE_INTERNAL_DETAIL',
      requestId: 'req_1'
    });
    const payload = toCheckoutFailurePayload(err);
    expect(payload).toEqual({
      error: 'PADDLE_CHECKOUT_FAILED',
      code: 'permission_denied',
      requestId: 'req_1',
      correlationId: 'corr_1'
    });
    expect(JSON.stringify(payload)).not.toContain('SENSITIVE_INTERNAL_DETAIL');
  });
});

describe('verifyPaddlePrices', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.PADDLE_ENV = 'production';
    process.env.PADDLE_API_KEY = LIVE_TEST_KEY;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  it('passes when all 4 prices are active and correct', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async (input) => {
        const url = String(input);
        const id = url.split('/').pop();
        const entry = Object.entries(PRICE_MAP).find(([, priceId]) => priceId === id)!;
        const minor = {
          STARTER: '1500',
          WORKSHOP: '5900',
          PROFESSIONAL: '14900',
          TEAM_WALLET: '39900'
        }[entry[0]]!;
        return jsonResponse(
          { data: { ...ACTIVE_PRICE, unit_price: { amount: minor, currency_code: 'USD' } } },
          200
        );
      })
    );
    const result = await verifyPaddlePrices(PRICE_MAP);
    expect(result.ok).toBe(true);
    expect(result.checks).toHaveLength(4);
    for (const c of result.checks) expect(c.ok).toBe(true);
  });

  it('fails on 404 price with error code preserved', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async (input) => {
        const url = String(input);
        if (url.includes('pri_01kvwh93mw594eqe3xcf6k6nbv')) {
          return jsonResponse(
            { error: { code: 'not_found' }, meta: { request_id: 'req_404' } },
            404
          );
        }
        return jsonResponse({ data: { ...ACTIVE_PRICE } }, 200);
      })
    );
    const result = await verifyPaddlePrices(PRICE_MAP);
    expect(result.ok).toBe(false);
    const starter = result.checks.find((c) => c.key === 'STARTER')!;
    expect(starter.ok).toBe(false);
    expect(starter.httpStatus).toBe(404);
    expect(starter.errorCode).toBe('not_found');
  });

  it('fails on inactive price', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async (input) => {
        const url = String(input);
        if (url.includes('pri_01kvwh93mw594eqe3xcf6k6nbv')) {
          return jsonResponse({ data: { ...ACTIVE_PRICE, status: 'archived' } }, 200);
        }
        return jsonResponse({ data: { ...ACTIVE_PRICE } }, 200);
      })
    );
    const result = await verifyPaddlePrices(PRICE_MAP);
    expect(result.ok).toBe(false);
    expect(result.checks.find((c) => c.key === 'STARTER')!.ok).toBe(false);
    expect(result.checks.find((c) => c.key === 'STARTER')!.errorCode).toContain('status=archived');
  });

  it('fails on wrong amount/currency', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<FetchMock>(async (input) => {
        const url = String(input);
        if (url.includes('pri_01kvwh93mw594eqe3xcf6k6nbv')) {
          return jsonResponse(
            { data: { ...ACTIVE_PRICE, unit_price: { amount: '1600', currency_code: 'EUR' } } },
            200
          );
        }
        return jsonResponse({ data: { ...ACTIVE_PRICE } }, 200);
      })
    );
    const result = await verifyPaddlePrices(PRICE_MAP);
    expect(result.ok).toBe(false);
    const starter = result.checks.find((c) => c.key === 'STARTER')!;
    expect(starter.errorCode).toContain('amount=1600');
    expect(starter.errorCode).toContain('currency=EUR');
  });
});

describe('getPaddleEnv (sandbox/live mismatch)', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('rejects sandbox key in production env', () => {
    process.env.PADDLE_ENV = 'production';
    process.env.PADDLE_API_KEY = SANDBOX_TEST_KEY;
    expect(() => getPaddleEnv()).toThrow(/pdl_live_apikey_/);
  });

  it('rejects production key in sandbox env', () => {
    process.env.PADDLE_ENV = 'sandbox';
    process.env.PADDLE_API_KEY = LIVE_TEST_KEY;
    expect(() => getPaddleEnv()).toThrow(/pdl_sdbx_apikey_/);
  });

  it('rejects empty key', () => {
    process.env.PADDLE_ENV = 'production';
    process.env.PADDLE_API_KEY = '  ';
    expect(() => getPaddleEnv()).toThrow(/PADDLE_API_KEY is empty/);
  });
});
