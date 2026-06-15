"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRegion } from "@/lib/compliance/region-context";
import {
  readEffectiveLocaleCookie,
  readGeoCountryCookie,
  readManualLocaleCookie,
  setLocaleCookie,
} from "@/lib/i18n/locale-client";
import {
  addLocaleToPath,
  isPrefixedLocalePath,
  resolveRootVisitLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";

const SESSION_GUARD_KEY = "sc_global_locale_redirect_v1";
const REDIRECT_DELAY_MS = 200;

const REGION_TO_LOCALE: Partial<Record<string, SupportedLocale>> = {
  TR: "tr",
  DE: "de",
};

function hasRedirectGuard(): boolean {
  try {
    return sessionStorage.getItem(SESSION_GUARD_KEY) === "1";
  } catch {
    return false;
  }
}

function setRedirectGuard(): void {
  try {
    sessionStorage.setItem(SESSION_GUARD_KEY, "1");
  } catch {
    // Safari private mode may block storage — redirect guard is best-effort.
  }
}

function resolveClientVisitLocale(
  navLang: string,
  regionCode: string,
  countryCode: string | null,
  cookieLocale: string | null,
): SupportedLocale {
  return resolveRootVisitLocale({
    cookieLocale: cookieLocale ?? undefined,
    manualCookie: readManualLocaleCookie() ? "1" : undefined,
    countryCode: countryCode ?? REGION_TO_LOCALE[regionCode] ?? null,
    acceptLanguage: navLang ? `${navLang},en;q=0.5` : null,
  });
}

/**
 * Firebase Hosting may serve prerendered English URLs without running middleware.
 * Redirect unprefixed English pages when geo/browser/region implies a prefixed locale.
 */
export function RootLocaleAutoRedirect() {
  const locale = useLocale();
  const { region } = useRegion();

  useEffect(() => {
    if (locale !== "en") {
      return;
    }

    const browserPath = window.location.pathname;
    if (isPrefixedLocalePath(browserPath)) {
      return;
    }
    if (readManualLocaleCookie()) {
      return;
    }
    if (readEffectiveLocaleCookie()) {
      return;
    }
    if (hasRedirectGuard()) {
      return;
    }

    const navLang = navigator.language?.toLowerCase() ?? "";
    const countryCode = readGeoCountryCookie();
    const targetLocale = resolveClientVisitLocale(
      navLang,
      region,
      countryCode,
      readEffectiveLocaleCookie(),
    );
    if (targetLocale === "en") {
      return;
    }

    const targetPath = addLocaleToPath(browserPath, targetLocale);
    if (!targetPath || targetPath === browserPath) {
      return;
    }

    setRedirectGuard();

    const timer = window.setTimeout(() => {
      if (window.location.pathname !== browserPath) {
        return;
      }
      setLocaleCookie(targetLocale);
      window.location.replace(targetPath);
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [locale, region]);

  return null;
}
