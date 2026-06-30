import "server-only";

/**
 * Premium Trace credit gate.
 * P9 stub: subscribers pass; per-query credit billing ships later.
 */
export async function checkPremiumAssistantCredit(
  userId: string,
  isPremium: boolean,
): Promise<{ ok: true } | { ok: false; reason: "no_subscription" | "no_credits" }> {
  if (!userId.trim()) {
    return { ok: false, reason: "no_subscription" };
  }

  if (isPremium) {
    return { ok: true };
  }

  const creditBillingEnabled = process.env.TRACE_PRO_CREDIT_BILLING === "true";
  if (!creditBillingEnabled) {
    return { ok: false, reason: "no_subscription" };
  }

  // Future: read Firestore credit balance and decrement on success.
  return { ok: false, reason: "no_credits" };
}

export async function consumePremiumAssistantCredit(userId: string): Promise<boolean> {
  void userId;
  if (process.env.TRACE_PRO_CREDIT_BILLING !== "true") {
    return false;
  }

  // Future: atomic Firestore decrement.
  return false;
}
