import {
 isDevelopmentProBypass,
 isProBypassEmail,
 PRO_BYPASS_EMAIL,
} from "@/lib/features/billing/subscription";

/** Premium analyzer URL segment - locale prefix optional. */
const PREMIUM_TOOL_PATH = /\/tools\/premium(?:\/|$)/;

export function isPremiumToolPath(pathname: string): boolean {
 return PREMIUM_TOOL_PATH.test(pathname);
}

export type PremiumRouteAccessInput = {
 email?: string | null;
 subscriptionStatus?: string | null;
};

/**
 * Global premium route access - dev bypass, super-user email, or active Stripe sub.
 * Used by middleware (pathname pass-through) and client gates.
 */
export function canAccessPremiumRoute({
 email,
 subscriptionStatus,
}: PremiumRouteAccessInput): boolean {
 if (isDevelopmentProBypass()) {
 return true;
 }

 if (isProBypassEmail(email)) {
 return true;
 }

 return subscriptionStatus === "active";
}

export function isSuperUserEmail(email: string | null | undefined): boolean {
 return isProBypassEmail(email);
}

export { PRO_BYPASS_EMAIL };
