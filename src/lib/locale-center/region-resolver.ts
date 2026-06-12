import { isRegionCode, localeToRegion, type RegionCode } from "@/config/regions";
import {
  getLocaleDefaultRegion,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/locale-center/locale-config";
import type { SupportedRegion } from "@/lib/locale-center/locale-types";

const LOCALE_PREFIX_RE = new RegExp(
  `^/(${SUPPORTED_LOCALES.filter((l) => l !== "en").join("|")})(?=/|$)`,
);

export function resolveLocaleFromPathname(pathname: string): SupportedLocale {
  const match = pathname.match(LOCALE_PREFIX_RE);
  if (match?.[1] && isSupportedLocale(match[1])) {
    return match[1];
  }
  return "en";
}

/** Map compliance RegionCode (TR/DE/EN) when present; else P30 locale default region. */
export function resolveRegionFromLocale(locale: SupportedLocale): SupportedRegion {
  return getLocaleDefaultRegion(locale);
}

export function resolveComplianceRegion(
  locale: SupportedLocale,
  manualRegionCookie?: string | null,
): RegionCode {
  if (manualRegionCookie && isRegionCode(manualRegionCookie)) {
    return manualRegionCookie;
  }
  return localeToRegion(locale);
}

export function resolveRegionFromPathname(
  pathname: string,
  manualRegionCookie?: string | null,
): SupportedRegion {
  const locale = resolveLocaleFromPathname(pathname);
  if (manualRegionCookie && isSupportedLocale(manualRegionCookie.toLowerCase())) {
    return getLocaleDefaultRegion(manualRegionCookie.toLowerCase() as SupportedLocale);
  }
  resolveComplianceRegion(locale, manualRegionCookie);
  return resolveRegionFromLocale(locale);
}
