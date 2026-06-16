/**
 * Apple-style geo locale bootstrap — synchronous head script for unprefixed English URLs.
 * Runs before React paint so TR/DE/FR/ES/AR visitors never flash English on cached static HTML.
 */

import {
  COUNTRY_COOKIE,
  COUNTRY_TO_LOCALE,
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  PREFIXED_LOCALES,
  ROOT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale-config";

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

export function resolveBootstrapTargetLocale(options: {
  readonly pathname: string;
  readonly manualLocale: boolean;
  readonly cookieLocale: string | null;
  readonly countryCode: string | null;
  readonly navigatorLanguage: string | null;
  readonly timezone: string | null;
}): SupportedLocale | null {
  if (isPrefixedLocalePathname(options.pathname)) {
    return null;
  }
  if (options.manualLocale) {
    return null;
  }

  if (options.cookieLocale && isSupportedLocale(options.cookieLocale) && options.cookieLocale !== ROOT_LOCALE) {
    return options.cookieLocale;
  }

  if (options.countryCode && options.countryCode in COUNTRY_TO_LOCALE) {
    return COUNTRY_TO_LOCALE[options.countryCode] ?? null;
  }

  const fromLanguage = detectLocaleFromNavigatorLanguage(options.navigatorLanguage);
  if (fromLanguage && fromLanguage !== ROOT_LOCALE) {
    return fromLanguage;
  }

  if (options.timezone && options.timezone in TIMEZONE_TO_COUNTRY) {
    const country = TIMEZONE_TO_COUNTRY[options.timezone];
    if (country && country in COUNTRY_TO_LOCALE) {
      return COUNTRY_TO_LOCALE[country] ?? null;
    }
  }

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

/** Minified IIFE injected into `<head>` on English-root pages. */
export function buildGeoLocaleBootstrapScript(): string {
  const countryMapJson = JSON.stringify(COUNTRY_TO_LOCALE);
  const timezoneMapJson = JSON.stringify(TIMEZONE_TO_COUNTRY);
  const prefixedLocalesJson = JSON.stringify(PREFIXED_LOCALES);

  return `(function(){try{
var SK=${JSON.stringify(GEO_BOOTSTRAP_SESSION_KEY)};
if(sessionStorage.getItem(SK)==="1")return;
var p=location.pathname;
var prefixed=${prefixedLocalesJson};
var re=new RegExp("^/("+prefixed.join("|")+")(?=/|$)");
if(re.test(p))return;
function gc(n){var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):null}
if(gc(${JSON.stringify(LOCALE_MANUAL_COOKIE)})==="1")return;
var cookieLocale=gc(${JSON.stringify(LOCALE_COOKIE)});
var target=null;
if(cookieLocale&&cookieLocale!==${JSON.stringify(ROOT_LOCALE)})target=cookieLocale;
var country=gc(${JSON.stringify(COUNTRY_COOKIE)});
var countryMap=${countryMapJson};
if(!target&&country&&countryMap[country])target=countryMap[country];
if(!target){var lang=(navigator.language||"").toLowerCase();var base=lang.split("-")[0];if(base&&base!==${JSON.stringify(ROOT_LOCALE)}&&prefixed.indexOf(base)>=0)target=base}
if(!target){try{var tz=Intl.DateTimeFormat().resolvedOptions().timeZone;var tzMap=${timezoneMapJson};if(tz&&tzMap[tz]&&countryMap[tzMap[tz]])target=countryMap[tzMap[tz]]}catch(e){}}
if(!target||target===${JSON.stringify(ROOT_LOCALE)})return;
sessionStorage.setItem(SK,"1");
document.cookie=${JSON.stringify(LOCALE_COOKIE)}+"="+target+";path=/;max-age=31536000;samesite=lax";
var next=p==="/"?"/"+target:"/"+target+p;
if(location.pathname+location.search+location.hash!==next+location.search+location.hash)location.replace(next+location.search+location.hash);
}catch(e){}})();`;
}
