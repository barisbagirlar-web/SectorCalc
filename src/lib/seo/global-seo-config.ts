/**
 * Global SEO configuration — canonical base URL and supported sitemap locales.
 */

import {
  getActiveLocales,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  ROOT_LOCALE,
} from "@/lib/i18n/locale-config";

const PRODUCTION_FALLBACK_URL = "https://sectorcalc-bf412.web.app";

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function resolveSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    const normalized = normalizeBaseUrl(raw);
    if (/localhost|127\.0\.0\.1/i.test(normalized)) {
      return PRODUCTION_FALLBACK_URL;
    }
    return normalized;
  }
  return PRODUCTION_FALLBACK_URL;
}

export const SITE_BASE_URL = resolveSiteBaseUrl();

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, ROOT_LOCALE, type SupportedLocale, isSupportedLocale };

export const INDEXABLE_LOCALE_ROUTES: Record<SupportedLocale, boolean> = {
  en: true,
};

export function getActiveSitemapLocales(): readonly SupportedLocale[] {
  return getActiveLocales().filter((locale) => INDEXABLE_LOCALE_ROUTES[locale]);
}
