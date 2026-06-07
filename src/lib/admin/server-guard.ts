/**
 * Server-only guard for admin lead pipeline writes.
 * Mirrors admin-light: enabled in dev, or production with explicit flag.
 */
export function isAdminServerUpdatesEnabled(): boolean {
 if (process.env.NODE_ENV !== "production") {
 return true;
 }
 return process.env.NEXT_PUBLIC_ENABLE_ADMIN_LIGHT === "true";
}

/**
 * Optional second layer: set ADMIN_LEAD_UPDATE_SECRET on the server.
 * When set, PATCH requests must send matching x-admin-lead-secret header.
 */
export function verifyAdminLeadUpdateSecret(request: Request): boolean {
 const expected = process.env.ADMIN_LEAD_UPDATE_SECRET?.trim();
 if (!expected) {
 return true;
 }
 const provided = request.headers.get("x-admin-lead-secret")?.trim();
 return provided === expected;
}
