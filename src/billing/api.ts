/**
 * Authenticated billing API client (Firebase ID token → Cloud Functions).
 */
import { getFirebaseAuth } from '../auth/firebase-app.js';

function apiBase(): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return (env?.VITE_BILLING_API_BASE || '/api').replace(/\/$/, '');
}

async function authHeader(): Promise<Record<string, string>> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error('NOT_AUTHENTICATED');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function safeJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const text = await res.text();
    return JSON.parse(text);
  } catch {
    return { error: `SERVER_ERROR_${res.status}` };
  }
}

export async function createCheckout(
  packageKey: string,
  returnTo?: string,
  retryCount = 0
): Promise<{
  purchaseId: string;
  paddleTransactionId: string;
}> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/billing/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ packageKey, returnTo: returnTo || null })
  });
  if (res.status === 429 && retryCount === 0) {
    await new Promise((r) => setTimeout(r, 800));
    return createCheckout(packageKey, returnTo, 1);
  }
  const body = await safeJson(res);
  if (!res.ok) throw new Error(String(body.error || body.message || 'CHECKOUT_FAILED'));
  trackBillingEvent('checkout_created', { packageKey });
  return body as { purchaseId: string; paddleTransactionId: string };
}

export async function getPurchaseStatus(purchaseId: string): Promise<{
  status: string;
  expectedCredits?: number;
  returnTo?: string | null;
}> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/billing/purchases/${encodeURIComponent(purchaseId)}`, {
    headers
  });
  const body = await safeJson(res);
  if (!res.ok) throw new Error(String(body.error || 'PURCHASE_STATUS_FAILED'));
  return body as unknown as { status: string; expectedCredits?: number; returnTo?: string | null };
}

export async function pollPurchaseCredited(
  purchaseId: string,
  opts?: { attempts?: number; delayMs?: number }
): Promise<{ status: string }> {
  const attempts = opts?.attempts ?? 20;
  const delayMs = opts?.delayMs ?? 1500;
  for (let i = 0; i < attempts; i++) {
    const st = await getPurchaseStatus(purchaseId);
    if (st.status === 'CREDITED') {
      trackBillingEvent('credit_purchase_credited', {});
      return st;
    }
    if (st.status === 'FAILED' || st.status === 'REFUNDED') {
      trackBillingEvent('credit_purchase_failed', { status: st.status });
      return st;
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return { status: 'CREDIT_ACTIVATION_PENDING' };
}

let walletCache: { promise: Promise<any>; timestamp: number } | null = null;

export function invalidateWalletCache(): void {
  walletCache = null;
}

export async function fetchWallet(): Promise<{
  purchasedCredits: number;
  promotionalCredits: number;
  creditDebt: number;
  spendableCredits: number;
}> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/wallet`, { headers });
  const body = await safeJson(res);
  if (!res.ok) throw new Error(String(body.error || 'WALLET_FAILED'));
  return body as unknown as {
    purchasedCredits: number;
    promotionalCredits: number;
    creditDebt: number;
    spendableCredits: number;
  };
}

export async function openProfessionalSessionApi(
  toolId: string,
  retryCount = 0
): Promise<
  | {
      sessionId: string;
      toolId: string;
      startedAt: string;
      expiresAt: string;
      creditCost: number;
      reused: boolean;
      newWalletBalance: number;
    }
  | { error: string; requiredCredits?: number; availableCredits?: number }
> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/tools/${encodeURIComponent(toolId)}/professional-session`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });
  if (res.status === 429 && retryCount === 0) {
    await new Promise((r) => setTimeout(r, 800));
    return openProfessionalSessionApi(toolId, 1);
  }
  const body = await safeJson(res);
  if (!res.ok) {
    return {
      error: String(
        body.error || (res.status === 503 ? 'TOOL_NOT_MONETIZED' : `SERVER_ERROR_${res.status}`)
      ),
      requiredCredits: body.requiredCredits as number | undefined,
      availableCredits: body.availableCredits as number | undefined
    };
  }
  return body as unknown as {
    sessionId: string;
    toolId: string;
    startedAt: string;
    expiresAt: string;
    creditCost: number;
    reused: boolean;
    newWalletBalance: number;
  };
}

/** GA4 / dataLayer billing events — never send engineering inputs or secrets. */
export function trackBillingEvent(
  name: string,
  meta: Record<string, string | number | undefined>
): void {
  const payload: Record<string, unknown> = { event: name };
  for (const [k, v] of Object.entries(meta)) {
    if (v !== undefined) payload[k] = v;
  }
  try {
    const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
    if (typeof w.gtag === 'function') {
      w.gtag('event', name, meta);
    }
  } catch {
    /* analytics best-effort */
  }
}
