import { getCurrentUserIdToken, getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";

export type CheckoutPlan = "pro" | "single_report" | "pro_annual" | "team";

export interface CreateCheckoutSessionOptions {
 toolSlug?: string;
 locale?: string;
 returnPath?: string;
 plan?: CheckoutPlan;
}

export type CreateCheckoutSessionResult =
 | { kind: "checkout"; checkoutUrl: string }
 | { kind: "login"; loginUrl: string };

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

export function buildCheckoutLoginUrl(returnPath = "/pricing"): string {
 return `/login?next=${encodeURIComponent(returnPath)}`;
}

function resolveToolSlugFromLocation(): string | undefined {
 if (typeof window === "undefined") {
 return undefined;
 }

 const tool = new URLSearchParams(window.location.search).get("tool");
 if (!tool || tool.trim().length === 0) {
 return undefined;
 }
 return tool.trim();
}

export async function createCheckoutSession(
 options: CreateCheckoutSessionOptions = {}
): Promise<CreateCheckoutSessionResult> {
 const auth = getFirebaseAuth();
 const user = auth?.currentUser;

 const returnPath = options.returnPath ?? "/pricing";
 if (!user) {
 return { kind: "login", loginUrl: buildCheckoutLoginUrl(returnPath) };
 }

 const endpoint = resolveCheckoutFunctionUrl();
 if (!endpoint) {
 throw new Error("Checkout is not configured.");
 }

 const idToken = await getCurrentUserIdToken(true);
 if (!idToken) {
 return { kind: "login", loginUrl: buildCheckoutLoginUrl(returnPath) };
 }

 const toolSlug = options.toolSlug ?? resolveToolSlugFromLocation();

 const response = await fetch(endpoint, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${idToken}`,
 },
 body: JSON.stringify({
 toolSlug,
 locale: options.locale,
 plan: options.plan ?? "pro",
 returnPath: options.returnPath,
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
 throw new Error(payload.error ?? "Unable to start checkout.");
 }

 return { kind: "checkout", checkoutUrl };
}

export async function startCheckoutSession(
 options: CreateCheckoutSessionOptions = {}
): Promise<void> {
 const result = await createCheckoutSession(options);
 if (result.kind === "login") {
 window.location.assign(result.loginUrl);
 return;
 }
 window.location.assign(result.checkoutUrl);
}
