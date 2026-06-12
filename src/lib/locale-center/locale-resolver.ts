import {
  getLocaleDefinition,
  getLocaleDirection,
  ROOT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/locale-center/locale-config";
import { resolveRegionFromLocale } from "@/lib/locale-center/region-resolver";
import type { SupportedRegion, TextDirection } from "@/lib/locale-center/locale-types";

export function normalizeSupportedLocale(value: string | undefined | null): SupportedLocale {
  const base = value?.split("-")[0]?.toLowerCase();
  if (base && isSupportedLocale(base)) {
    return base;
  }
  return ROOT_LOCALE;
}

export function resolveRequestLocale(candidate: string | undefined | null): SupportedLocale {
  if (candidate && isSupportedLocale(candidate)) {
    return candidate;
  }
  return ROOT_LOCALE;
}

export type ResolvedLocaleContext = {
  readonly locale: SupportedLocale;
  readonly region: SupportedRegion;
  readonly direction: TextDirection;
  readonly numberLocale: string;
  readonly dateLocale: string;
  readonly isRtl: boolean;
};

export function resolveLocaleContext(localeInput: string | undefined | null): ResolvedLocaleContext {
  const locale = normalizeSupportedLocale(localeInput ?? undefined);
  const definition = getLocaleDefinition(locale);
  const region = resolveRegionFromLocale(locale);
  const direction = getLocaleDirection(locale);

  return {
    locale,
    region,
    direction,
    numberLocale: definition.numberLocale,
    dateLocale: definition.dateLocale,
    isRtl: direction === "rtl",
  };
}

export function assertAppLocale(value: string): SupportedLocale {
  if (!isSupportedLocale(value)) {
    return ROOT_LOCALE;
  }
  return value;
}
