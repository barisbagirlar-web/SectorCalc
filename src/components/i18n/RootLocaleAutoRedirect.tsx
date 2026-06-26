"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRegion } from "@/lib/compliance/region-context";
import {
  readEffectiveLocaleCookie,
  readManualLocaleCookie,
  setLocaleCookie,
} from "@/lib/i18n/locale-client";
import {
  isPrefixedLocalePath,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";
import { getLocalePathPrefix } from "@/lib/i18n/locale-config";

const SESSION_GUARD_KEY = "sc_root_locale_redirect_v1";
const REDIRECT_DELAY_MS = 200;

const BROWSER_LOCALE_REDIRECTS: Partial<Record<string, string>> = {
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  ar: "ar",
};

const REGION_TO_LOCALE: Partial<Record<string, string>> = {
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

function resolveClientFallbackLocale(
  navLang: string,
  regionCode: string,
): SupportedLocale | null {
  const base = navLang.split("-")[0]?.toLowerCase() ?? navLang;
  const fromBrowser = BROWSER_LOCALE_REDIRECTS[base];
  if (fromBrowser && fromBrowser === "en") {
    return fromBrowser as SupportedLocale;
  }
  const fromRegion = REGION_TO_LOCALE[regionCode];
  if (fromRegion && fromRegion === "en") {
    return fromRegion as SupportedLocale;
  }
  return null;
}

/**
 * Firebase Hosting may serve prerendered `/` without running middleware.
 * Redirect root English visitors when geo/browser/region implies a prefixed locale.
 * Mount only on the English home page — never on /tr or other locale routes.
 */
export function RootLocaleAutoRedirect() {
  const locale = useLocale();
  const { region } = useRegion();

  useEffect(() => {
    if (locale !== "en") {
      return;
    }

    const browserPath = window.location.pathname;
    if (browserPath !== "/") {
      return;
    }
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
    const targetLocale = resolveClientFallbackLocale(navLang, region);
    if (!targetLocale) {
      return;
    }

    const prefix = getLocalePathPrefix(targetLocale);
    if (!prefix || browserPath === prefix) {
      return;
    }

    setRedirectGuard();

    const timer = window.setTimeout(() => {
      if (window.location.pathname !== "/") {
        return;
      }
      setLocaleCookie(targetLocale);
      window.location.replace(prefix);
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [locale, region]);

  return null;
}
