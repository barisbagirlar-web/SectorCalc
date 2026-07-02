/**
 * Admin panel access is gated by Firebase Auth + custom claim (admin: true).
 * NEXT_PUBLIC_ENABLE_ADMIN_LIGHT is deprecated - no longer used for /admin/leads.
 */

/** @deprecated Admin-light flag replaced by Firebase Auth admin claim. */
export function isAdminLightEnabled(): boolean {
 if (process.env.NODE_ENV !== "production") {
 return true;
 }
 return process.env.NEXT_PUBLIC_ENABLE_ADMIN_LIGHT === "true";
}

/** @deprecated */
export function isAdminLightDisabledInProduction(): boolean {
 return (
 process.env.NODE_ENV === "production" &&
 process.env.NEXT_PUBLIC_ENABLE_ADMIN_LIGHT !== "true"
 );
}

/** @deprecated */
export function isAdminLightExplicitlyEnabledInProduction(): boolean {
 return (
 process.env.NODE_ENV === "production" &&
 process.env.NEXT_PUBLIC_ENABLE_ADMIN_LIGHT === "true"
 );
}
