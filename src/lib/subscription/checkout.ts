import { getCurrentUserIdToken } from "@/lib/firebase/auth";

function resolveCheckoutFunctionUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_FUNCTION_URL?.trim();
  if (configured) {
    return configured;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!projectId) {
    return null;
  }

  return `https://us-central1-${projectId}.cloudfunctions.net/createStripeCheckout`;
}

export interface CreateCheckoutSessionResult {
  url: string;
}

export async function createProCheckoutSession(): Promise<CreateCheckoutSessionResult> {
  const endpoint = resolveCheckoutFunctionUrl();
  if (!endpoint) {
    throw new Error("Checkout is not configured.");
  }

  const idToken = await getCurrentUserIdToken(true);
  if (!idToken) {
    throw new Error("Sign in is required before checkout.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      plan: "pro",
      successUrl: `${window.location.origin}/pricing?checkout=success`,
      cancelUrl: `${window.location.origin}/pricing?checkout=cancel`,
    }),
  });

  const payload = (await response.json()) as {
    success?: boolean;
    url?: string;
    error?: string;
  };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? "Unable to start checkout.");
  }

  return { url: payload.url };
}
