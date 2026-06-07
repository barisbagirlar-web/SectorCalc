"use client";

import { LOCALE_COOKIE, type SupportedLocale } from "@/lib/i18n/locale-routing";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function setLocaleCookie(locale: SupportedLocale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
}

export function readLocaleCookie(): SupportedLocale | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match?.[1];
  if (value === "en" || value === "tr") {
    return value;
  }
  return null;
}
