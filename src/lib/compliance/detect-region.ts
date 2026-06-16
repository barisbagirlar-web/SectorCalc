import type { NextRequest } from "next/server";
import {
  countryToRegion,
  isRegionCode,
  REGION_COOKIE,
  REGION_HEADER,
  REGION_MANUAL_COOKIE,
  type RegionCode,
} from "@/config/regions";
import { resolveRegionFromRequestContext } from "@/lib/compliance/resolve-region";

const GEO_COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cf-ip-country",
  "x-country-code",
  "x-country",
  "cloudfront-viewer-country",
  "x-appengine-country",
  "fastly-client-ip-country",
  "x-real-country",
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
 * Resolve region with proper priority order:
 * 1. Manual cookie (user explicitly chose a region)
 * 2. Request country header (Cloudflare, Vercel, CDN geo detection)
 * 3. Locale fallback (URL path → region)
 * 4. Global default (EN)
 *
 * Manual selection always wins. Auto-detection never overwrites manual choice.
 */
export function detectRegionFromRequest(request: NextRequest): RegionResolutionResult {
  // 1. Manual cookie wins
  const manual = request.cookies.get(REGION_MANUAL_COOKIE)?.value;
  if (manual && isRegionCode(manual)) {
    return { region: manual, source: "manual-cookie" };
  }

  // 2. Request country header (auto-detection)
  const detectedCountry = detectCountryFromHeaders(request.headers);
  if (detectedCountry) {
    const regionFromCountry = countryToRegion(detectedCountry);
    // Use country header only if it maps to a specific supported region (TR, DE)
    // Unknown countries get EN from countryToRegion, but we prefer locale fallback in that case
    if (detectedCountry === "TR" || detectedCountry === "DE") {
      return { region: regionFromCountry, source: "request-country" };
    }
  }

  // 3. Locale fallback
  const localeRegion = resolveRegionFromRequestContext(request.nextUrl.pathname, null);
  const isGlobalDefault = localeRegion === "EN" && !detectedCountry;
  return {
    region: localeRegion,
    source: isGlobalDefault ? "global-default" : "locale-fallback",
  };
}
