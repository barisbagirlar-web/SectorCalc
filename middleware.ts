import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { REGION_COOKIE, REGION_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/compliance/detect-region";

/**
 * Locale routing + Regional Compliance geo detection.
 *
 * Region resolution: manual sc-region-manual cookie → locale (/en→EN/USD, /tr→TR/TRY).
 * Sets response header x-region and sync cookie sc-region (365d).
 *
 * Premium access is NOT handled here — see premium-route-access.ts
 */
const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const region = detectRegionFromRequest(request);
  const response = intlMiddleware(request);

  if (response instanceof NextResponse) {
    response.headers.set(REGION_HEADER, region);
    response.cookies.set(REGION_COOKIE, region, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const next = NextResponse.next();
  next.headers.set(REGION_HEADER, region);
  next.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return next;
}

export const config = {
  matcher: [
    "/",
    "/(en|tr|es|de|ar)/:path*",
    "/((?!admin|_next|_vercel|.*\\..*).*)",
  ],
};
