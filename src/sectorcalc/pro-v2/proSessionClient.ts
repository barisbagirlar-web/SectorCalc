// SectorCalc PRO V2 — Session Client
// POST /api/pro-tool-session/create with Firebase ID token.
// Returns usageSessionId and remainingRuns.

export interface CreateSessionResult {
  ok: true;
  usageSessionId: string;
  remainingRuns: number;
  creditCost: number;
  status: string;
}

export interface CreateSessionError {
  ok: false;
  status: number;
  error: string;
}

export type CreateSessionResponse = CreateSessionResult | CreateSessionError;

/**
 * Create a PRO session for the given toolKey.
 * Requires a valid Firebase ID token (freshly obtained).
 * Returns usageSessionId directly — no fire-and-forget, no stale state.
 */
export async function createCreditSession(
  toolKey: string,
  idToken: string,
): Promise<CreateSessionResponse> {
  try {
    const res = await fetch("/api/pro-tool-session/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ toolKey }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data.error ?? "SESSION_CREATE_FAILED",
      };
    }

    return {
      ok: true,
      usageSessionId: data.usageSessionId,
      remainingRuns: data.remainingRuns,
      creditCost: data.creditCost ?? 1,
      status: data.status ?? "ACTIVE",
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "NETWORK_ERROR",
    };
  }
}
