import type { NextRequest } from "next/server";
import { isRegionCode, REGION_MANUAL_COOKIE, type RegionCode } from "@/config/regions";
import { resolveRegionFromRequestContext } from "@/lib/features/compliance/resolve-region";

const GEO_COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "cloudfront-viewer-country",
] as const;

export type RegionSource =
  | "manual-cookie"
  | "request-country"
  | "locale-fallback"
  | "global-default";

export interface RegionResolutionResult {
  region: RegionCode;
  source: RegionSource;
}

/** Read ISO country from Vercel Geo, Cloudflare, or CDN edge headers. */
export function detectCountryFromHeaders(
  headers: Headers | { get(name: string): string | null },
): string | null {
  for (const name of GEO_COUNTRY_HEADERS) {
    const value = headers.get(name);
    if (value && value.length === 2) {
      return value.toUpperCase();
    }
  }
  return null;
}

/**
 * Middleware-safe region detection: does NOT read cookies.
 * Region is derived ONLY from URL locale path (/en, /de, /tr).
 * CDN geo headers are IGNORED because:
 * 1. This is a single-language (EN) site - TR and DE support does not exist.
 * 2. Geo headers (x-country-code) would incorrectly set region=TR for TR visitors.
 * 3. Manual cookie override is handled in Server Components via getServerRegion().
 */
export function detectRegionFromRequest(request: NextRequest): RegionResolutionResult {
  const localeRegion = resolveRegionFromRequestContext(request.nextUrl.pathname, null);
  return {
    region: localeRegion,
    source: localeRegion === "EN" ? "global-default" : "locale-fallback",
  };
}

/**
 * Full region detection including manual cookie check.
 * Use in Server Components / Server Actions where Vary: cookie is acceptable.
 */
export function detectRegionWithCookie(request: NextRequest): RegionResolutionResult {
  const manual = request.cookies.get(REGION_MANUAL_COOKIE)?.value;
  if (manual && isRegionCode(manual)) {
    return { region: manual, source: "manual-cookie" };
  }
  return detectRegionFromRequest(request);
}
