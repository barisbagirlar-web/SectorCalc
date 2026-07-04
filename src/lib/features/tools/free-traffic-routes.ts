/**
 * Free traffic routes - permanently purged. All exports return empty.
 */

export function listRevenueFreeSlugs(): readonly string[] { return []; }
export function listAllFreeToolSlugs(): readonly string[] { return []; }
export function listPublicFreeToolSlugs(): readonly string[] { return []; }
export function getFreeToolRoutePath(_slug: string): string { return ""; }
export function getPremiumToolRoutePath(slug: string): string {
  return `/tools/premium/${slug}`;
}
export function listAllPremiumToolRouteSlugs(): readonly string[] { return []; }
