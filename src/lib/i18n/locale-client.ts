"use client";

import {
  LOCALE_COOKIE,
  LOCALE_MANUAL_COOKIE,
  COUNTRY_COOKIE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale-routing";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${value};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
}

export function setLocaleCookie(
  locale: SupportedLocale,
  options?: { readonly manual?: boolean },
): void {
  writeCookie(LOCALE_COOKIE, locale);
  if (options?.manual) {
    writeCookie(LOCALE_MANUAL_COOKIE, "1");
  }
}

export function clearManualLocaleCookie(): void {
  writeCookie(LOCALE_MANUAL_COOKIE, "0");
}

export function readLocaleCookie(): SupportedLocale | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match?.[1];
  return value && isSupportedLocale(value) ? value : null;
}

export function readManualLocaleCookie(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_MANUAL_COOKIE}=([^;]*)`));
  return match?.[1] === "1";
}

export function readEffectiveLocaleCookie(): SupportedLocale | null {
  const locale = readLocaleCookie();
  if (!locale) {
    return null;
  }
  if (readManualLocaleCookie()) {
    return locale;
  }
  return locale === "en" ? null : locale;
}


export function readGeoCountryCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]*)`));
  const value = match?.[1]?.trim().toUpperCase();
  return value && value.length === 2 ? value : null;
}
