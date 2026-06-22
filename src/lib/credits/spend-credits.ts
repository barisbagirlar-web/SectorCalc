import { getCurrentUserIdToken, getFirebaseAuth } from "@/lib/firebase/auth";
import { resolveSpendCreditsUrl } from "@/lib/credits/credit-billing-env";

export interface SpendCreditsOptions {
  amount?: number;
  toolSlug?: string;
}

export type SpendCreditsResult =
  | { ok: true; spent: number }
  | { ok: false; code: "INSUFFICIENT_CREDITS" | "UNAUTHORIZED" | "ERROR"; message: string };

function resolveSpendCreditsFunctionUrl(): string | null {
  return resolveSpendCreditsUrl();
}

export async function spendCreditsViaFunction(
  options: SpendCreditsOptions = {}
): Promise<SpendCreditsResult> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) {
    return { ok: false, code: "UNAUTHORIZED", message: "Sign in required." };
  }

  const endpoint = resolveSpendCreditsFunctionUrl();
  if (!endpoint) {
    return { ok: false, code: "ERROR", message: "Credit spending is not configured." };
  }

  const idToken = await getCurrentUserIdToken(true);
  if (!idToken) {
    return { ok: false, code: "UNAUTHORIZED", message: "Sign in required." };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        amount: options.amount ?? 1,
        toolSlug: options.toolSlug,
      }),
    });
  } catch {
    return { ok: false, code: "ERROR", message: "Credit service unreachable." };
  }

  let payload: { success?: boolean; spent?: number; error?: string; code?: string };
  try {
    payload = (await response.json()) as {
      success?: boolean;
      spent?: number;
      error?: string;
      code?: string;
    };
  } catch {
    return { ok: false, code: "ERROR", message: "Invalid response from credit service." };
  }

  if (response.status === 402 || payload.code === "INSUFFICIENT_CREDITS") {
    return {
      ok: false,
      code: "INSUFFICIENT_CREDITS",
      message: payload.error ?? "Insufficient credits.",
    };
  }

  if (!response.ok || !payload.success) {
    return {
      ok: false,
      code: response.status === 401 ? "UNAUTHORIZED" : "ERROR",
      message: payload.error ?? "Unable to spend credits.",
    };
  }

  return { ok: true, spent: payload.spent ?? options.amount ?? 1 };
}
