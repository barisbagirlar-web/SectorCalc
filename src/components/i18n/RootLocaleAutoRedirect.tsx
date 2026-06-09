"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { readLocaleCookie } from "@/lib/i18n/locale-client";
import {
  stripLocaleFromPath,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";
import { getLocalePathPrefix } from "@/lib/i18n/locale-config";

const BROWSER_LOCALE_REDIRECTS: Partial<Record<string, SupportedLocale>> = {
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  ar: "ar",
};

/**
 * Firebase Hosting may serve prerendered `/` without running middleware.
 * When no manual locale cookie exists, redirect root English visitors whose
 * browser language matches a prefixed locale (e.g. tr-TR → /tr).
 */
export function RootLocaleAutoRedirect() {
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (locale !== "en") {
      return;
    }
    if (stripLocaleFromPath(pathname) !== "/") {
      return;
    }
    if (readLocaleCookie()) {
      return;
    }

    const navLang = navigator.language?.toLowerCase() ?? "";
    const base = navLang.split("-")[0] ?? navLang;
    const targetLocale = BROWSER_LOCALE_REDIRECTS[base];
    if (!targetLocale) {
      return;
    }

    const prefix = getLocalePathPrefix(targetLocale);
    if (prefix && window.location.pathname !== prefix) {
      window.location.replace(prefix);
    }
  }, [locale, pathname]);

  return null;
}
