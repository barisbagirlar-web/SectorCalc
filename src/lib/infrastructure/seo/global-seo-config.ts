/* eslint-disable */
// @ts-nocheck

/**
 * Global SEO configuration — canonical base URL and supported sitemap locales.
 *
 * IMPORTANT: SITE_BASE_URL is hardcoded to the production domain because:
 * 1. Sitemap/canonical URLs must always point to the public origin.
 * 2. Firebase frameworks may inject NEXT_PUBLIC_SITE_URL pointing to
 *    the Firebase staging URL (sectorcalc-bf412.web.app) during build.
 * 3. .env.local is gitignored and not always present in build env.
 *
 * For local development this value is only used for sitemap generation,
 * which is not consumed by search engines from localhost.
 */

import {
  getActiveLocales,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  ROOT_LOCALE,
} from "@/lib/infrastructure/i18n/locale-config";

/** Canonical public origin — always production domain. */
export const SITE_BASE_URL = "https://www.sectorcalc.com";

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, ROOT_LOCALE, type SupportedLocale, isSupportedLocale };

export const INDEXABLE_LOCALE_ROUTES: Record<SupportedLocale, boolean> = {
  en: true,
};

export function getActiveSitemapLocales(): readonly SupportedLocale[] {
  return getActiveLocales().filter((locale) => INDEXABLE_LOCALE_ROUTES[locale]);
}
