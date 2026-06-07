export const LEAD_INTENTS_COLLECTION = "leadIntents";
export const USERS_COLLECTION = "users";
export const USER_PURCHASES_SUBCOLLECTION = "purchases";
export const PREMIUM_ENTITLEMENTS_COLLECTION = "premiumEntitlements";

/** Stripe Checkout plan identifiers (session metadata). */
export const CHECKOUT_PLAN_PRO = "pro" as const;
export const CHECKOUT_PLAN_SINGLE_REPORT = "single_report" as const;
export const CHECKOUT_PLAN_PRO_ANNUAL = "pro_annual" as const;
export const CHECKOUT_PLAN_TEAM = "team" as const;

/** Firebase param names for Stripe price IDs (USD global list). */
export const STRIPE_PRICE_SINGLE_VERDICT_PARAM = "STRIPE_PRICE_SINGLE_VERDICT";
export const STRIPE_PRICE_PRO_ANNUAL_PARAM = "STRIPE_PRICE_PRO_ANNUAL";
export const STRIPE_PRICE_TEAM_PARAM = "STRIPE_PRICE_TEAM";

/**
 * Firestore (default) database location — set at provisioning; never change via code.
 * Verified: firebase firestore:databases:get '(default)' --project sectorcalc-bf412
 */
export const FIRESTORE_DATABASE_LOCATION = "nam5" as const;

/**
 * Region for new Revenue Flow HTTPS functions (Stripe checkout, webhooks, billing, reports).
 * Pair with nam5 Firestore: us-central1 is the project standard (all functions deployed here).
 */
export const DEFAULT_FUNCTION_REGION = "us-central1" as const;

/**
 * Frozen region for stable admin lead functions.
 * Do not change or redeploy to another region without an explicit migration plan.
 */
export const ADMIN_FUNCTION_REGION = "us-central1" as const;

export const ALLOWED_ORIGINS = [
  "https://sectorcalc-bf412.web.app",
  "https://sectorcalc.com",
  "https://www.sectorcalc.com",
  "http://localhost:3000",
] as const;
