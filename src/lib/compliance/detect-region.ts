import type { NextRequest } from "next/server";
import {
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
  "x-country-code",
  "cloudfront-viewer-country",
] as const;

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
 * Resolve region: manual override cookie → UI locale (/en→USD, /tr→TRY, /de→EUR).
 * Geo IP is intentionally NOT used so language and currency stay aligned.
 */
export function detectRegionFromRequest(request: NextRequest): RegionCode {
  const manual = request.cookies.get(REGION_MANUAL_COOKIE)?.value;
  return resolveRegionFromRequestContext(request.nextUrl.pathname, manual);
}
