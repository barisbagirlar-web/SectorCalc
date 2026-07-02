/**
 * Apple-style geo locale bootstrap - synchronous head script for unprefixed English URLs.
 * Runs before React paint so TR/DE/FR/ES/AR visitors never flash English on cached static HTML.
 *
 * EN-only: all functions are no-ops. Stale locale cookies are cleaned on page load.
 */

import {
  COUNTRY_COOKIE,
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  PREFIXED_LOCALES,
  ROOT_LOCALE,
  type SupportedLocale,
} from "@/lib/infrastructure/i18n/locale-config";

export const GEO_BOOTSTRAP_SESSION_KEY = "sc_geo_locale_boot_v1";

const BOOTSTRAP_LOCALES = PREFIXED_LOCALES.join("|");

/** IANA timezone → ISO country hints when edge geo headers are unavailable (Firebase static CDN). */
export const TIMEZONE_TO_COUNTRY: Readonly<Record<string, string>> = {
  "Europe/Istanbul": "TR",
  "Europe/Berlin": "DE",
  "Europe/Vienna": "AT",
  "Europe/Zurich": "CH",
  "Europe/Paris": "FR",
  "Europe/Brussels": "BE",
  "Europe/Madrid": "ES",
  "America/Mexico_City": "MX",
  "America/Argentina/Buenos_Aires": "AR",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Africa/Cairo": "EG",
};

export function resolveBootstrapTargetLocale(_options: {
  readonly pathname: string;
  readonly manualLocale: boolean;
  readonly cookieLocale: string | null;
  readonly countryCode: string | null;
  readonly navigatorLanguage: string | null;
  readonly timezone: string | null;
}): SupportedLocale | null {
  // EN-only site - never redirect to another locale
  return null;
}

export function isPrefixedLocalePathname(pathname: string): boolean {
  return new RegExp(`^/(${BOOTSTRAP_LOCALES})(?=\\/|$)`).test(pathname);
}

export function buildPrefixedLocalePath(pathname: string, locale: SupportedLocale): string {
  if (locale === ROOT_LOCALE) {
    return pathname;
  }
  if (pathname === "/") {
    return `/${locale}`;
  }
  return `/${locale}${pathname}`;
}

function detectLocaleFromNavigatorLanguage(language: string | null): SupportedLocale | null {
  if (!language) {
    return null;
  }
  const base = language.split("-")[0]?.toLowerCase();
  if (!base) {
    return null;
  }
  if (base === ROOT_LOCALE) {
    return ROOT_LOCALE;
  }
  if ((PREFIXED_LOCALES as readonly string[]).includes(base)) {
    return base as SupportedLocale;
  }
  return null;
}

/** Minified IIFE injected into `<head>` on every page. EN-only: cleans old locale cookies AND unregisters any old service worker so cached redirects never survive a page load. */
export function buildGeoLocaleBootstrapScript(): string {
  const cookieNames = [LOCALE_COOKIE, COUNTRY_COOKIE, LOCALE_MANUAL_COOKIE];
  const namesJson = JSON.stringify(cookieNames);
  return [
    "(function(){try{",
    `var n=${namesJson};`,
    "for(var i=0;i<n.length;i++){document.cookie=n[i]+'=;path=/;max-age=0;samesite=lax'}",
    "if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})});",
    "}catch(e){}})();",
  ].join("");
}
