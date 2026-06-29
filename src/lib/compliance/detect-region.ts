import type { NextRequest } from "next/server";
import {
  countryToRegion,
  isRegionCode,
  REGION_HEADER,
  REGION_MANUAL_COOKIE,
  type RegionCode,
} from "@/config/regions";
import { resolveRegionFromRequestContext } from "@/lib/compliance/resolve-region";

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
 * Reading `request.cookies` causes Next.js to add `Vary: cookie` to the response,
 * which fragments the CDN cache. Manual cookie override is handled
 * in Server Components via `getServerRegion()`.
 *
 * Priority: country header → locale fallback → global default (EN).
 */
export function detectRegionFromRequest(request: NextRequest): RegionResolutionResult {
  const detectedCountry = detectCountryFromHeaders(request.headers);
  if (detectedCountry) {
    const regionFromCountry = countryToRegion(detectedCountry);
    if (detectedCountry === "TR" || detectedCountry === "DE") {
      return { region: regionFromCountry, source: "request-country" };
    }
  }

  const localeRegion = resolveRegionFromRequestContext(request.nextUrl.pathname, null);
  const isGlobalDefault = localeRegion === "EN" && !detectedCountry;
  return {
    region: localeRegion,
    source: isGlobalDefault ? "global-default" : "locale-fallback",
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
