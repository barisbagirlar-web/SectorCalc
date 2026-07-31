/**
 * Client entitlement API — read-only. Status/expiry/canAccess are ALWAYS
 * computed server-side; the browser only renders what the backend returns.
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

export interface EntitlementView {
  id: string;
  toolId: string;
  toolName: string;
  toolUrl: string;
  status: string;
  accessType: string;
  startsAt: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  usageLimit: number | null;
  usageConsumed: number;
  usageRemaining: number | null;
  creditsRemaining: number;
  creditCost: number;
  canAccess: boolean;
  sessionActive: boolean;
  lastUsedAt: string | null;
  purchasedAt: string;
}

export interface MyEntitlementsResponse {
  tools: EntitlementView[];
  creditsRemaining: number;
}

async function safeJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const text = await res.text();
    return JSON.parse(text);
  } catch {
    return { error: `SERVER_ERROR_${res.status}` };
  }
}

export async function fetchMyEntitlements(): Promise<MyEntitlementsResponse> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/my/tools`, { headers });
  const body = await safeJson(res);
  if (!res.ok) throw new Error(String(body.error || 'MY_TOOLS_FAILED'));
  return body as unknown as MyEntitlementsResponse;
}

export async function fetchToolEntitlement(toolId: string): Promise<EntitlementView> {
  const headers = await authHeader();
  const res = await fetch(`${apiBase()}/tools/${encodeURIComponent(toolId)}/entitlement`, {
    headers
  });
  const body = await safeJson(res);
  if (!res.ok) throw new Error(String(body.error || 'ENTITLEMENT_FAILED'));
  return body as unknown as EntitlementView;
}
