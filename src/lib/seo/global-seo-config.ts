/**
 * Global SEO configuration — canonical base URL and supported sitemap locales.
 */

import { siteUrl } from "@/config/site";
import {
  getActiveLocales,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  ROOT_LOCALE,
} from "@/lib/i18n/locale-config";

/** Canonical origin for sitemap, hreflang clusters, and IndexNow. */
export const SITE_BASE_URL = siteUrl;

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, ROOT_LOCALE, type SupportedLocale, isSupportedLocale };

export const INDEXABLE_LOCALE_ROUTES: Record<SupportedLocale, boolean> = {
  en: true,
  tr: true,
  de: true,
  fr: true,
  es: true,
  ar: true,
};

export function getActiveSitemapLocales(): readonly SupportedLocale[] {
  return getActiveLocales().filter((locale) => INDEXABLE_LOCALE_ROUTES[locale]);
}

/**
 * Prefer the canonical production host; fall back to request host on custom domains.
 */
export function resolveSitemapBaseUrl(request?: Request): string {
  if (!request) {
    return SITE_BASE_URL;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = (forwardedHost ?? request.headers.get("host") ?? "")
    .split(",")[0]
    ?.trim()
    .toLowerCase();

  if (!host) {
    return SITE_BASE_URL;
  }

  if (host === "sectorcalc.com" || host === "www.sectorcalc.com") {
    return `https://www.sectorcalc.com`;
  }

  if (host.endsWith(".sectorcalc.com")) {
    return `https://${host}`;
  }

  return SITE_BASE_URL;
}
