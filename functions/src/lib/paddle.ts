import { getPaddleEnv, apiBaseForEnv } from './config';

export async function paddleFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const key = process.env.PADDLE_API_KEY || '';
  if (!key)
    throw Object.assign(new Error('PADDLE_CONFIGURATION_ERROR: PADDLE_API_KEY missing'), {
      status: 503
    });
  const env = getPaddleEnv();
  const url = `${apiBaseForEnv(env)}${path}`;
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${key}`);
  headers.set('Paddle-Version', '1');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(url, { ...init, headers });
}

export async function createPaddleTransaction(input: {
  priceId: string;
  purchaseId: string;
  packageKey: string;
  customerEmail?: string;
}): Promise<{ id: string }> {
  const body = {
    items: [{ price_id: input.priceId, quantity: 1 }],
    custom_data: {
      sectorcalc_purchase_id: input.purchaseId,
      sectorcalc_package_key: input.packageKey
    },
    enable_checkout: true
  };
  const res = await paddleFetch('/transactions', { method: 'POST', body: JSON.stringify(body) });
  const json = (await res.json()) as { data?: { id?: string }; error?: unknown };
  if (!res.ok || !json.data?.id) {
    console.error('paddle_create_transaction_failed', {
      status: res.status,
      error: json.error || json
    });
    throw Object.assign(new Error('PADDLE_CONFIGURATION_ERROR: create transaction failed'), {
      status: 502
    });
  }
  return { id: json.data.id };
}

export async function getPaddleTransaction(
  transactionId: string
): Promise<Record<string, unknown>> {
  const res = await paddleFetch(`/transactions/${transactionId}`);
  const json = (await res.json()) as { data?: Record<string, unknown>; error?: unknown };
  if (!res.ok || !json.data) {
    throw new Error(`Paddle transaction fetch failed: ${JSON.stringify(json.error || json)}`);
  }
  return json.data;
}
