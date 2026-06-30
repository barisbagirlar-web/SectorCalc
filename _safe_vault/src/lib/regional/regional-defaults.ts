import { LOCALE_DEFINITIONS } from "@/lib/i18n/locale-config";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { getDefaultCurrencyForRegion, getDefaultLocaleForRegion, getDefaultUnitSystemForRegion, getRegionConfig } from "@/lib/regional/regions";
import type { RegionalEngineCode, RegionalCurrencyCode, UnitSystemId } from "@/lib/regional/types";

export function getDefaultUnitSystem(regionCode: RegionalEngineCode): UnitSystemId {
  return getDefaultUnitSystemForRegion(regionCode);
}

export function getDefaultCurrency(regionCode: RegionalEngineCode): RegionalCurrencyCode {
  return getDefaultCurrencyForRegion(regionCode);
}

export function getRegionalNumberLocale(regionCode: RegionalEngineCode): string {
  return LOCALE_DEFINITIONS[getDefaultLocaleForRegion(regionCode)].numberLocale;
}

export function getRegionalDateLocale(regionCode: RegionalEngineCode): string {
  return LOCALE_DEFINITIONS[getDefaultLocaleForRegion(regionCode)].dateLocale;
}

export function getRegionalFormatDefaults(regionCode: RegionalEngineCode) {
  const config = getRegionConfig(regionCode);
  return { decimalSeparator: config.decimalSeparator, thousandSeparator: config.thousandSeparator, dateFormat: config.dateFormat, numberLocale: getRegionalNumberLocale(regionCode), dateLocale: getRegionalDateLocale(regionCode) };
}

export function resolveLocaleForRegion(regionCode: RegionalEngineCode, localeOverride?: string): SupportedLocale {
  if (localeOverride) {
    const base = localeOverride.split("-")[0]?.toLowerCase();
    if (base && base in LOCALE_DEFINITIONS) return base as SupportedLocale;
  }
  return getDefaultLocaleForRegion(regionCode);
}
