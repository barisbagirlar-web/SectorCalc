"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import {
  readGeoCountryCookie,
  readLocaleCookie,
  readManualLocaleCookie,
  setLocaleCookie,
} from "@/lib/i18n/locale-client";
import {
  GEO_BOOTSTRAP_SESSION_KEY,
  resolveBootstrapTargetLocale,
  buildPrefixedLocalePath,
  isPrefixedLocalePathname,
} from "@/lib/i18n/geo-locale-bootstrap";
import { ROOT_LOCALE, type SupportedLocale } from "@/lib/i18n/locale-routing";

/**
 * Secondary fallback when head bootstrap did not run (SPA navigation, storage blocked).
 * Primary geo redirect lives in GeoLocaleBootstrapScript (before first paint).
 */
export function RootLocaleAutoRedirect() {
  const locale = useLocale();

  useEffect(() => {
    if (locale !== ROOT_LOCALE) {
      return;
    }

    const browserPath = window.location.pathname;
    if (isPrefixedLocalePathname(browserPath)) {
      return;
    }

    let bootstrapRan = false;
    try {
      bootstrapRan = sessionStorage.getItem(GEO_BOOTSTRAP_SESSION_KEY) === "1";
    } catch {
      bootstrapRan = false;
    }

    const targetLocale = resolveBootstrapTargetLocale({
      pathname: browserPath,
      manualLocale: readManualLocaleCookie(),
      cookieLocale: readLocaleCookie(),
      countryCode: readGeoCountryCookie(),
      navigatorLanguage: navigator.language?.toLowerCase() ?? null,
      timezone: (() => {
        try {
          return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
        } catch {
          return null;
        }
      })(),
    }) as SupportedLocale | null;

    if (!targetLocale || targetLocale === ROOT_LOCALE) {
      return;
    }

    const targetPath = buildPrefixedLocalePath(browserPath, targetLocale);
    if (!targetPath || targetPath === browserPath) {
      return;
    }

    if (bootstrapRan) {
      return;
    }

    setLocaleCookie(targetLocale);
    window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`);
  }, [locale]);

  return null;
}
