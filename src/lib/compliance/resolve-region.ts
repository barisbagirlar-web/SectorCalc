import {
  isRegionCode,
  localeToRegion,
  REGION_MANUAL_COOKIE,
  type RegionCode,
} from "@/config/regions";

const LOCALE_PREFIX = /^\/(en|tr|es|de|ar)(\/|$)/;

/** Extract locale segment from App Router pathname. */
export function extractLocaleFromPathname(pathname: string): string {
  const match = pathname.match(LOCALE_PREFIX);
  return match?.[1] ?? "en";
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
