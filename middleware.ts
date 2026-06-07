import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { REGION_COOKIE, REGION_HEADER } from "@/config/regions";
import { detectCountryFromHeaders, detectRegionFromRequest } from "@/lib/compliance/detect-region";
import {
  getLegacyEnRedirectPath,
  isMiddlewareExcludedPath,
  LOCALE_COOKIE,
  needsEnglishLocaleRewrite,
  rewritePathToEnglishLocale,
  shouldRedirectRootToTurkish,
} from "@/lib/i18n/locale-routing";

/**
 * Locale routing (root English + /tr Turkish) + regional compliance.
 *
 * Premium access is NOT handled here — see premium-route-access.ts
 */
const intlMiddleware = createIntlMiddleware(routing);

function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const region = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMiddlewareExcludedPath(pathname)) {
    return applyRegionHeaders(NextResponse.next(), request);
  }

  const legacyRedirect = getLegacyEnRedirectPath(pathname);
  if (legacyRedirect !== null) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirect;
    return applyRegionHeaders(NextResponse.redirect(url, 301), request);
  }

  if (pathname === "/") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (
      shouldRedirectRootToTurkish({
        cookieLocale,
        countryCode: detectCountryFromHeaders(request.headers),
        acceptLanguage: request.headers.get("accept-language"),
      })
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/tr";
      return applyRegionHeaders(NextResponse.redirect(url, 307), request);
    }
  }

  if (needsEnglishLocaleRewrite(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = rewritePathToEnglishLocale(pathname);
    const response = NextResponse.rewrite(url);
    return applyRegionHeaders(response, request);
  }

  const response = intlMiddleware(request);
  if (response instanceof NextResponse) {
    return applyRegionHeaders(response, request);
  }

  return applyRegionHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/",
    "/(tr)/:path*",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};
