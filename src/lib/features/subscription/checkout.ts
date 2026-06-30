export {
 createCheckoutSession,
 startCheckoutSession,
 buildCheckoutLoginUrl,
 type CreateCheckoutSessionOptions,
 type CreateCheckoutSessionResult,
} from "@/lib/features/billing/create-checkout-session";

import {
 createCheckoutSession,
 type CreateCheckoutSessionResult,
} from "@/lib/features/billing/create-checkout-session";

/** @deprecated Use createCheckoutSession from @/lib/features/billing/create-checkout-session */
export async function createProCheckoutSession(): Promise<{ url: string }> {
 const result: CreateCheckoutSessionResult = await createCheckoutSession();
 if (result.kind === "login") {
 throw new Error("Sign in is required before checkout.");
 }
 return { url: result.checkoutUrl };
}
