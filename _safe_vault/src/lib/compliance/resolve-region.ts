import {
  isRegionCode,
  localeToRegion,
  REGION_MANUAL_COOKIE,
  type RegionCode,
} from "@/config/regions";
import { parseLocaleFromPath, type SupportedLocale } from "@/lib/i18n/locale-routing";

/** Extract locale from pathname — unprefixed paths are English root. */
export function extractLocaleFromPathname(pathname: string): SupportedLocale {
  return parseLocaleFromPath(pathname) ?? "en";
}

/** Manual cookie → else locale drives region. */
export function resolveRegionFromRequestContext(
  pathname: string,
  manualCookie: string | undefined | null,
): RegionCode {
  const locale = extractLocaleFromPathname(pathname);
  if (manualCookie && isRegionCode(manualCookie)) {
    return manualCookie;
  }
  return localeToRegion(locale);
}

export { REGION_MANUAL_COOKIE } from "@/config/regions";
