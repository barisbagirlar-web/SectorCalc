export const locales = ["en"] as const;
export type AppLocale = (typeof locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

/** Path without locale prefix — English root paths unchanged. */
export function stripLocalePrefix(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  return pathname;
}
