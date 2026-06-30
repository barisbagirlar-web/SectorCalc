"use client";

import {
  buildCheckoutLoginUrl,
  createCheckoutSession,
} from "@/lib/features/billing/create-checkout-session";
import {
  getBillingPlanById,
  mapBillingPlanToCheckoutPlan,
  resolveSafeReturnPath,
  type BillingPlanId,
} from "@/lib/features/billing/billing-config";

export type StartCheckoutOptions = {
  readonly planId: BillingPlanId;
  readonly locale?: string;
  readonly premiumSlug?: string;
  readonly returnPath?: string;
};

export type StartCheckoutResult =
  | { readonly kind: "redirect"; readonly url: string }
  | { readonly kind: "login"; readonly loginUrl: string };

export class CheckoutStartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutStartError";
  }
}

export async function startCheckout(options: StartCheckoutOptions): Promise<StartCheckoutResult> {
  getBillingPlanById(options.planId);

  const returnPath = resolveSafeReturnPath(options.returnPath);
  const legacyPlan = mapBillingPlanToCheckoutPlan(options.planId);

  try {
    const result = await createCheckoutSession({
      plan: legacyPlan,
      toolSlug: options.premiumSlug,
      locale: options.locale,
      returnPath,
    });

    if (result.kind === "login") {
      return { kind: "login", loginUrl: result.loginUrl };
    }

    if (!result.checkoutUrl) {
      throw new CheckoutStartError("Checkout is not available right now.");
    }

    return { kind: "redirect", url: result.checkoutUrl };
  } catch (error) {
    if (error instanceof CheckoutStartError) {
      throw error;
    }
    const message =
      error instanceof Error && error.message.trim().length > 0
        ? error.message
        : "Checkout is not available right now.";
    throw new CheckoutStartError(message);
  }
}

/** Redirect helper — use from click handlers. Falls back to login URL when unsigned. */
export async function startCheckoutRedirect(options: StartCheckoutOptions): Promise<void> {
  const result = await startCheckout(options);
  if (result.kind === "login") {
    window.location.assign(result.loginUrl ?? buildCheckoutLoginUrl(resolveSafeReturnPath(options.returnPath)));
    return;
  }
  window.location.assign(result.url);
}
