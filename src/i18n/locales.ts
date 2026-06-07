import { stripLocaleFromPath } from "@/lib/i18n/locale-routing";

export const locales = ["en", "tr"] as const;
export type AppLocale = (typeof locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

/** Path without locale prefix — English root paths unchanged. */
export function stripLocalePrefix(pathname: string): string {
  return stripLocaleFromPath(pathname);
}
