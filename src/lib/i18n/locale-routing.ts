/**
 * Root English + prefixed locale URL architecture (en, tr, de, fr, es, ar).
 */

import {
  COUNTRY_TO_LOCALE,
  DEFAULT_LOCALE,
  getLocalePathPrefix,
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  NEXT_LOCALE_COOKIE,
  PREFIXED_LOCALES,
  ROOT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  isSupportedLocale,
} from "@/lib/i18n/locale-config";

export {
  COUNTRY_TO_LOCALE,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  NEXT_LOCALE_COOKIE,
  ROOT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  isSupportedLocale,
};

const LOCALE_SEGMENT_PATTERN = SUPPORTED_LOCALES.join("|");
const LOCALE_PREFIX = new RegExp(`^/(${LOCALE_SEGMENT_PATTERN})(?=\\/|$)`);

const MIDDLEWARE_EXCLUDED_EXACT = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/ai.txt",
  "/ai-tool-index.json",
  "/ai-tool-index.txt",
  "/ai-categories.json",
  "/ai-tool-routes.json",
  "/ai-search-manifest.json",
  "/ai-embedding-source.jsonl",
  "/sectorcalc-index.txt",
  "/services-products.txt",
  "/faq-knowledge.txt",
  "/manifest.json",
]);

const MIDDLEWARE_EXCLUDED_PREFIXES = ["/api", "/admin", "/_next", "/assets", "/images", "/icons"] as const;

const STATIC_FILE_EXTENSION =
  /\.(?:ico|png|jpe?g|gif|webp|svg|txt|xml|json|jsonl|woff2?|ttf|eot|css|js|map)$/i;

export const LOCALE_LESS_PUBLIC_ROUTES = [
  "/free-tools",
  "/premium-tools",
  "/industries",
  "/pricing",
  "/calculator-library",
  "/categories",
] as const;

export function isLocalizedPath(pathname: string): boolean {
  return LOCALE_PREFIX.test(pathname);
}

export function parseLocaleFromPath(pathname: string): SupportedLocale | null {
  const match = pathname.match(LOCALE_PREFIX);
  if (!match) {
    return null;
  }
  const segment = match[1];
  return isSupportedLocale(segment) ? segment : null;
}

export function isLocalePath(pathname: string, locale: SupportedLocale): boolean {
  const prefix = getLocalePathPrefix(locale);
  if (locale === ROOT_LOCALE) {
    return !isLocalizedPath(pathname) || pathname === "/en" || pathname.startsWith("/en/");
  }
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** @deprecated Use isLocalePath(pathname, "tr") */
export function isTurkishPath(pathname: string): boolean {
  return isLocalePath(pathname, "tr");
}

export function isPrefixedLocalePath(pathname: string): boolean {
  const locale = parseLocaleFromPath(pathname);
  return locale !== null && locale !== ROOT_LOCALE;
}

export function stripLocaleFromPath(pathname: string | null | undefined): string {
  if (!pathname) {
    return "/";
  }
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const locale = parseLocaleFromPath(normalized);
  if (!locale) {
    return normalized;
  }
  if (normalized === `/${locale}`) {
    return "/";
  }
  const rest = normalized.slice(locale.length + 1);
  return rest.length > 0 ? rest : "/";
}

export function addLocaleToPath(pathname: string, locale: SupportedLocale): string {
  const base = stripLocaleFromPath(pathname);
  const normalized =
    base === "/" ? "/" : base.startsWith("/") ? base : `/${base}`;

  if (locale === ROOT_LOCALE) {
    return normalized;
  }

  const prefix = getLocalePathPrefix(locale);
  if (normalized === "/") {
    return prefix;
  }

  return `${prefix}${normalized}`;
}

export function switchPathLocale(pathname: string, locale: SupportedLocale): string {
  return addLocaleToPath(stripLocaleFromPath(pathname), locale);
}

export function getCanonicalPathForLocale(
  pathname: string,
  locale: SupportedLocale,
): string {
  return addLocaleToPath(stripLocaleFromPath(pathname), locale);
}

export function needsEnglishLocaleRewrite(pathname: string): boolean {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return false;
  }
  if (isPrefixedLocalePath(pathname)) {
    return false;
  }
  return true;
}

export function rewritePathToEnglishLocale(pathname: string): string {
  if (pathname === "/") {
    return "/en";
  }
  return `/en${pathname}`;
}

export function getLegacyEnRedirectPath(pathname: string): string | null {
  if (pathname === "/en") {
    return "/";
  }
  if (pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest.length > 0 ? rest : "/";
  }
  return null;
}

export function isMiddlewareExcludedPath(pathname: string): boolean {
  if (MIDDLEWARE_EXCLUDED_EXACT.has(pathname)) {
    return true;
  }
  if (MIDDLEWARE_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  if (STATIC_FILE_EXTENSION.test(pathname)) {
    return true;
  }
  return false;
}

function detectLocaleFromAcceptLanguage(acceptLanguage: string | null): SupportedLocale | null {
  if (!acceptLanguage) {
    return null;
  }
  const tags = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter((tag): tag is string => Boolean(tag));

  for (const tag of tags) {
    const base = tag.split("-")[0] ?? tag;
    if (isSupportedLocale(base) && base !== ROOT_LOCALE) {
      return base;
    }
    if (base === "en") {
      return ROOT_LOCALE;
    }
  }
  return null;
}

export function getEffectiveLocaleCookie(options: {
  readonly cookieLocale: string | undefined;
  readonly nextLocaleCookie: string | undefined;
  readonly manualCookie: string | undefined;
}): SupportedLocale | undefined {
  const manual = options.manualCookie === "1";
  const raw = options.cookieLocale ?? options.nextLocaleCookie;
  if (!raw || !isSupportedLocale(raw)) {
    return undefined;
  }

  if (manual) {
    return raw;
  }

  if (raw !== ROOT_LOCALE) {
    return raw;
  }

  return undefined;
}

export function resolveRootVisitLocale(options: {
  readonly cookieLocale: string | undefined;
  readonly nextLocaleCookie?: string | undefined;
  readonly manualCookie?: string | undefined;
  readonly countryCode: string | null;
  readonly acceptLanguage: string | null;
}): SupportedLocale {
  const effectiveCookie = getEffectiveLocaleCookie({
    cookieLocale: options.cookieLocale,
    nextLocaleCookie: options.nextLocaleCookie,
    manualCookie: options.manualCookie,
  });
  if (effectiveCookie) {
    return effectiveCookie;
  }

  if (options.countryCode && options.countryCode in COUNTRY_TO_LOCALE) {
    const localeFromCountry = COUNTRY_TO_LOCALE[options.countryCode];
    if (localeFromCountry) {
      return localeFromCountry;
    }
  }

  const fromAccept = detectLocaleFromAcceptLanguage(options.acceptLanguage);
  if (fromAccept) {
    return fromAccept;
  }

  return ROOT_LOCALE;
}

export function shouldRedirectRootToLocale(options: {
  readonly cookieLocale: string | undefined;
  readonly nextLocaleCookie?: string | undefined;
  readonly manualCookie?: string | undefined;
  readonly countryCode: string | null;
  readonly acceptLanguage: string | null;
}): SupportedLocale | null {
  const resolved = resolveRootVisitLocale(options);
  if (resolved === ROOT_LOCALE) {
    return null;
  }
  return resolved;
}

export function isLocaleLessPublicRoute(pathname: string): boolean {
  return LOCALE_LESS_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function shouldRedirectLocaleLessPublicRoute(options: {
  readonly pathname: string;
  readonly cookieLocale: string | undefined;
  readonly nextLocaleCookie?: string | undefined;
  readonly manualCookie?: string | undefined;
  readonly countryCode: string | null;
  readonly acceptLanguage: string | null;
}): SupportedLocale | null {
  if (!isLocaleLessPublicRoute(options.pathname)) {
    return null;
  }
  const resolved = resolveRootVisitLocale(options);
  if (resolved === ROOT_LOCALE) {
    return null;
  }
  return resolved;
}

/** @deprecated Use shouldRedirectRootToLocale */
export function shouldRedirectRootToTurkish(options: {
  readonly cookieLocale: string | undefined;
  readonly countryCode: string | null;
  readonly acceptLanguage: string | null;
}): boolean {
  return shouldRedirectRootToLocale(options) === "tr";
}

export function buildPrefixedLocaleMatcherSegment(): string {
  return PREFIXED_LOCALES.join("|");
}
