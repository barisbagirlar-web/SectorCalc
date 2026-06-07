import {
  isRegionCode,
  localeToRegion,
  REGION_MANUAL_COOKIE,
  type RegionCode,
} from "@/config/regions";
import { isTurkishPath } from "@/lib/i18n/locale-routing";

/** Extract locale from pathname — root paths are English. */
export function extractLocaleFromPathname(pathname: string): string {
  if (isTurkishPath(pathname)) {
    return "tr";
  }
  return "en";
}

/** Manual cookie → else locale drives region (en/es/ar→EN, tr→TR, de→DE). */
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

export { REGION_MANUAL_COOKIE };
