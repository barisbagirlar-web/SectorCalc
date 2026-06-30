import { getCurrentUserIdToken, getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { buildCheckoutLoginUrl } from "@/lib/features/billing/create-checkout-session";
import { resolveCreditCheckoutUrl } from "@/lib/features/credits/credit-billing-env";

export interface CreateCreditCheckoutOptions {
  packageId: string;
  locale?: string;
}

export type CreateCreditCheckoutResult =
  | { kind: "checkout"; checkoutUrl: string }
  | { kind: "login"; loginUrl: string };

function resolveCreditCheckoutFunctionUrl(): string | null {
  return resolveCreditCheckoutUrl();
}

export async function createCreditCheckoutSession(
  options: CreateCreditCheckoutOptions
): Promise<CreateCreditCheckoutResult> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  const returnPath = "/account/credits";

  if (!user) {
    return { kind: "login", loginUrl: buildCheckoutLoginUrl(returnPath) };
  }

  const endpoint = resolveCreditCheckoutFunctionUrl();
  if (!endpoint) {
    throw new Error("Credit checkout is not configured.");
  }

  const idToken = await getCurrentUserIdToken(true);
  if (!idToken) {
    return { kind: "login", loginUrl: buildCheckoutLoginUrl(returnPath) };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      packageId: options.packageId,
      locale: options.locale,
    }),
  });

  const payload = (await response.json()) as {
    success?: boolean;
    checkoutUrl?: string;
    url?: string;
    error?: string;
  };

  const checkoutUrl = payload.checkoutUrl ?? payload.url;
  if (!response.ok || !checkoutUrl) {
    throw new Error(payload.error ?? "Unable to start credit checkout.");
  }

  return { kind: "checkout", checkoutUrl };
}

export async function startCreditCheckoutSession(
  options: CreateCreditCheckoutOptions
): Promise<void> {
  const result = await createCreditCheckoutSession(options);
  if (result.kind === "login") {
    window.location.assign(result.loginUrl);
    return;
  }
  window.location.assign(result.checkoutUrl);
}
