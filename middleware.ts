import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { REGION_COOKIE, REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectCountryFromHeaders, detectRegionFromRequest } from "@/lib/compliance/detect-region";
import { getLocalePathPrefix } from "@/lib/i18n/locale-config";
import {
  buildPrefixedLocaleMatcherSegment,
  getLegacyEnRedirectPath,
  isMiddlewareExcludedPath,
  LOCALE_COOKIE,
  needsEnglishLocaleRewrite,
  rewritePathToEnglishLocale,
  shouldRedirectRootToLocale,
} from "@/lib/i18n/locale-routing";

/**
 * Locale routing (root English + prefixed locales) + regional compliance.
 */
const intlMiddleware = createIntlMiddleware(routing);

function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const { region, source } = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.headers.set(REGION_SOURCE_HEADER, source);
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
    const targetLocale = shouldRedirectRootToLocale({
      cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
      countryCode: detectCountryFromHeaders(request.headers),
      acceptLanguage: request.headers.get("accept-language"),
    });
    if (targetLocale !== null) {
      const url = request.nextUrl.clone();
      url.pathname = getLocalePathPrefix(targetLocale);
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

const prefixedLocales = buildPrefixedLocaleMatcherSegment();

export const config = {
  matcher: [
    "/",
    `/(${prefixedLocales})/:path*`,
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};
