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

export async function createCheckout(packageKey: string, returnTo?: string): Promise<{
  purchaseId: string;
  paddleTransactionId: string;
}> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/billing/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ packageKey, returnTo: returnTo || null })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || body.message || 'CHECKOUT_FAILED');
  return body;
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
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'PURCHASE_STATUS_FAILED');
  return body;
}

export async function pollPurchaseCredited(
  purchaseId: string,
  opts?: { attempts?: number; delayMs?: number }
): Promise<{ status: string }> {
  const attempts = opts?.attempts ?? 20;
  const delayMs = opts?.delayMs ?? 1500;
  for (let i = 0; i < attempts; i++) {
    const st = await getPurchaseStatus(purchaseId);
    if (st.status === 'CREDITED' || st.status === 'FAILED' || st.status === 'REFUNDED') return st;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return { status: 'CREDIT_ACTIVATION_PENDING' };
}

export async function fetchWallet(): Promise<{
  purchasedCredits: number;
  promotionalCredits: number;
  creditDebt: number;
  spendableCredits: number;
}> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/wallet`, { headers });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'WALLET_FAILED');
  return body;
}
