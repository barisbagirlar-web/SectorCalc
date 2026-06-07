/**
 * Global SEO configuration — canonical base URL and supported sitemap locales.
 */

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

export const SUPPORTED_LOCALES = ["en", "tr"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const INDEXABLE_LOCALE_ROUTES: Record<SupportedLocale, boolean> = {
  en: true,
  tr: true,
};

export function getActiveSitemapLocales(): readonly SupportedLocale[] {
  return SUPPORTED_LOCALES.filter((locale) => INDEXABLE_LOCALE_ROUTES[locale]);
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
