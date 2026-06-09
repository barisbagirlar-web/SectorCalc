"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { readLocaleCookie, setLocaleCookie } from "@/lib/i18n/locale-client";
import {
  isPrefixedLocalePath,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";
import { getLocalePathPrefix } from "@/lib/i18n/locale-config";

const SESSION_GUARD_KEY = "sc_root_locale_redirect_v1";
const REDIRECT_DELAY_MS = 200;

const BROWSER_LOCALE_REDIRECTS: Partial<Record<string, SupportedLocale>> = {
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  ar: "ar",
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

/**
 * Firebase Hosting may serve prerendered `/` without running middleware.
 * Redirect root English visitors whose browser language matches a prefixed locale.
 * Mount only on the English home page — never on /tr or other locale routes.
 */
export function RootLocaleAutoRedirect() {
  const locale = useLocale();

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
    if (readLocaleCookie()) {
      return;
    }
    if (hasRedirectGuard()) {
      return;
    }

    const navLang = navigator.language?.toLowerCase() ?? "";
    const base = navLang.split("-")[0] ?? navLang;
    const targetLocale = BROWSER_LOCALE_REDIRECTS[base];
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
  }, [locale]);

  return null;
}
