import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing-config";
import {
  isUnitSystemPreference,
  resolveUnitSystemPreference,
  UNIT_SYSTEM_COOKIE,
  UNIT_SYSTEM_HEADER,
  UNIT_SYSTEM_MANUAL_COOKIE,
} from "@/config/measurement";
import { REGION_COOKIE, REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectCountryFromHeaders, detectRegionFromRequest } from "@/lib/compliance/detect-region";
import {
  addLocaleToPath,
  COUNTRY_COOKIE,
  getLegacyEnRedirectPath,
  getLocalizedPathRedirect,
  isLocalizedPath,
  isMiddlewareExcludedPath,
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  NEXT_LOCALE_COOKIE,
  needsEnglishLocaleRewrite,
  rewritePathToEnglishLocale,
  shouldRedirectUnlocalizedPath,
  stripLocaleFromPath,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";
import { migrateGeneratedToolSlugPath } from "@/lib/tools/generated-tool-slug-redirects";
import { shouldAllowToolPageFraming } from "@/lib/tools/embed-policy";
/**
 * Locale routing (root English + prefixed locales) + regional compliance.
 */
const intlMiddleware = createIntlMiddleware(routing);

function isPaidToolPath(pathname: string): boolean {
  const path = stripLocaleFromPath(pathname);
  return path.startsWith("/tools/premium/") || path.startsWith("/tools/premium-schema/");
}

function applyToolFramingHeaders(response: NextResponse, pathname: string): void {
  if (!pathname.includes("/tools/")) {
    return;
  }
  if (shouldAllowToolPageFraming(pathname)) {
    return;
  }
  if (isPaidToolPath(pathname)) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  }
}

function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const { region, source } = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.headers.set(REGION_SOURCE_HEADER, source);
  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const manualUnitSystem = request.cookies.get(UNIT_SYSTEM_MANUAL_COOKIE)?.value;
  const cookieUnitSystem = request.cookies.get(UNIT_SYSTEM_COOKIE)?.value;
  const countryCode = detectCountryFromHeaders(request.headers);
  const unitSystem = resolveUnitSystemPreference({
    manual: manualUnitSystem,
    cookie: cookieUnitSystem,
    country: countryCode,
  });

  if (countryCode) {
    response.cookies.set(COUNTRY_COOKIE, countryCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  response.headers.set(UNIT_SYSTEM_HEADER, unitSystem);
  response.cookies.set(UNIT_SYSTEM_COOKIE, unitSystem, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  if (isUnitSystemPreference(manualUnitSystem)) {
    response.cookies.set(UNIT_SYSTEM_MANUAL_COOKIE, manualUnitSystem, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  applyToolFramingHeaders(response, request.nextUrl.pathname);
  return response;
}

function readLocaleResolutionInputs(request: NextRequest) {
  return {
    cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    nextLocaleCookie: request.cookies.get(NEXT_LOCALE_COOKIE)?.value,
    manualCookie: request.cookies.get(LOCALE_MANUAL_COOKIE)?.value,
    countryCode: detectCountryFromHeaders(request.headers),
    acceptLanguage: request.headers.get("accept-language"),
  };
}

function redirectToLocale(
  request: NextRequest,
  locale: SupportedLocale,
  pathname: string,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = addLocaleToPath(pathname, locale);
  const response = NextResponse.redirect(url, 307);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  response.cookies.set(NEXT_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return applyRegionHeaders(response, request);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMiddlewareExcludedPath(pathname)) {
    return applyRegionHeaders(NextResponse.next(), request);
  }

  const bareGeneratedRedirect = migrateGeneratedToolSlugPath(pathname);
  if (bareGeneratedRedirect !== null) {
    const url = request.nextUrl.clone();
    url.pathname = bareGeneratedRedirect;
    return applyRegionHeaders(NextResponse.redirect(url, 301), request);
  }

  // Legacy /en/ → root redirect: only for homepage, not for tool/content pages
  const legacyRedirect = getLegacyEnRedirectPath(pathname);
  if (legacyRedirect !== null && !isLocalizedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirect;
    return applyRegionHeaders(NextResponse.redirect(url, 301), request);
  }

  const localizedRedirect = getLocalizedPathRedirect(pathname);
  if (localizedRedirect !== null) {
    const url = request.nextUrl.clone();
    url.pathname = localizedRedirect;
    return applyRegionHeaders(NextResponse.redirect(url, 301), request);
  }

  if (isLocalizedPath(pathname)) {
    // Explicit /en/ paths: set English cookie so locale stays English
    if (pathname === "/en" || pathname.startsWith("/en/")) {
      const response = NextResponse.next();
      response.cookies.set(LOCALE_COOKIE, "en", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      response.cookies.set(NEXT_LOCALE_COOKIE, "en", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return applyRegionHeaders(response, request);
    }
    const response = intlMiddleware(request);
    if (response instanceof NextResponse) {
      return applyRegionHeaders(response, request);
    }
    return applyRegionHeaders(NextResponse.next(), request);
  }

  const localeInputs = readLocaleResolutionInputs(request);

  const unlocalizedTarget = shouldRedirectUnlocalizedPath({
    pathname,
    ...localeInputs,
  });
  if (unlocalizedTarget !== null) {
    return redirectToLocale(request, unlocalizedTarget, pathname);
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
    "/api-public/:path*",
    "/",
    "/(en|tr|de|fr|es|ar)/:path*",
    "/((?!admin|api|api-public|_next|_vercel|.*\\..*).*)",
  ],
};
