/**
 * Root English + /tr Turkish URL architecture.
 * English canonical paths have no locale prefix; Turkish uses /tr.
 */

export const DEFAULT_LOCALE = "en";
export const TURKISH_LOCALE = "tr";
export const ROOT_LOCALE = "en";

export const SUPPORTED_LOCALES = ["en", "tr"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_COOKIE = "sectorcalc_locale";

const LOCALE_PREFIX = /^\/(en|tr)(?=\/|$)/;

const MIDDLEWARE_EXCLUDED_EXACT = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/sectorcalc-index.txt",
  "/services-products.txt",
  "/faq-knowledge.txt",
  "/manifest.json",
]);

const MIDDLEWARE_EXCLUDED_PREFIXES = ["/api", "/admin", "/_next"] as const;

const STATIC_FILE_EXTENSION =
  /\.(?:ico|png|jpe?g|gif|webp|svg|txt|xml|json|woff2?|ttf|eot|css|js|map)$/i;

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isLocalizedPath(pathname: string): boolean {
  return LOCALE_PREFIX.test(pathname);
}

export function isTurkishPath(pathname: string): boolean {
  return pathname === "/tr" || pathname.startsWith("/tr/");
}

export function stripLocaleFromPath(pathname: string): string {
  if (pathname === "/en" || pathname === "/tr") {
    return "/";
  }
  if (pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest.length > 0 ? rest : "/";
  }
  if (pathname.startsWith("/tr/")) {
    const rest = pathname.slice(3);
    return rest.length > 0 ? rest : "/";
  }
  return pathname;
}

export function addLocaleToPath(pathname: string, locale: SupportedLocale): string {
  const base = stripLocaleFromPath(pathname);
  const normalized =
    base === "/" ? "/" : base.startsWith("/") ? base : `/${base}`;

  if (locale === "en") {
    return normalized;
  }

  if (normalized === "/") {
    return "/tr";
  }

  return `/tr${normalized}`;
}

export function getCanonicalPathForLocale(
  pathname: string,
  locale: SupportedLocale,
): string {
  return addLocaleToPath(stripLocaleFromPath(pathname), locale);
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

export function shouldRedirectRootToTurkish(options: {
  readonly cookieLocale: string | undefined;
  readonly countryCode: string | null;
  readonly acceptLanguage: string | null;
}): boolean {
  if (options.cookieLocale === "en") {
    return false;
  }
  if (options.cookieLocale === "tr") {
    return true;
  }
  if (options.countryCode?.toUpperCase() === "TR") {
    return true;
  }
  const accept = options.acceptLanguage?.toLowerCase() ?? "";
  return accept.startsWith("tr");
}
