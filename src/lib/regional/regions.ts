import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { normalizeLocale } from "@/lib/format/localization";
import { localeToRegion, type RegionCode } from "@/config/regions";
import type { RegionalConfig, RegionalEngineCode } from "@/lib/regional/types";

export const REGIONAL_ENGINE_CODES = ["GLOBAL", "TR", "US", "DE", "FR", "ES", "AR"] as const;

const REGION_CONFIGS: Record<RegionalEngineCode, RegionalConfig> = {
  GLOBAL: { regionCode: "GLOBAL", label: "Global", defaultLocale: "en", defaultCurrency: "USD", defaultUnitSystem: "metric", decimalSeparator: ".", thousandSeparator: ",", dateFormat: "yyyy-MM-dd", measurementSystem: "metric", supportedUnitSystems: ["metric", "imperial"] },
  TR: { regionCode: "TR", label: "Turkey", defaultLocale: "tr", defaultCurrency: "TRY", defaultUnitSystem: "metric", decimalSeparator: ",", thousandSeparator: ".", dateFormat: "dd.MM.yyyy", measurementSystem: "metric", supportedUnitSystems: ["metric"] },
  US: { regionCode: "US", label: "United States", defaultLocale: "en", defaultCurrency: "USD", defaultUnitSystem: "imperial", decimalSeparator: ".", thousandSeparator: ",", dateFormat: "MM/dd/yyyy", measurementSystem: "us_customary", supportedUnitSystems: ["imperial", "metric"] },
  DE: { regionCode: "DE", label: "Germany", defaultLocale: "de", defaultCurrency: "EUR", defaultUnitSystem: "metric", decimalSeparator: ",", thousandSeparator: ".", dateFormat: "dd.MM.yyyy", measurementSystem: "metric", supportedUnitSystems: ["metric"] },
  FR: { regionCode: "FR", label: "France", defaultLocale: "fr", defaultCurrency: "EUR", defaultUnitSystem: "metric", decimalSeparator: ",", thousandSeparator: " ", dateFormat: "dd/MM/yyyy", measurementSystem: "metric", supportedUnitSystems: ["metric"] },
  ES: { regionCode: "ES", label: "Spain", defaultLocale: "es", defaultCurrency: "EUR", defaultUnitSystem: "metric", decimalSeparator: ",", thousandSeparator: ".", dateFormat: "dd/MM/yyyy", measurementSystem: "metric", supportedUnitSystems: ["metric"] },
  AR: { regionCode: "AR", label: "Arabic Markets", defaultLocale: "ar", defaultCurrency: "USD", defaultUnitSystem: "metric", decimalSeparator: ".", thousandSeparator: ",", dateFormat: "dd/MM/yyyy", measurementSystem: "metric", supportedUnitSystems: ["metric", "imperial"] },
};

const LOCALE_TO_REGIONAL: Record<SupportedLocale, RegionalEngineCode> = { en: "GLOBAL", tr: "TR", de: "DE", fr: "FR", es: "ES", ar: "AR" };
const COMPLIANCE_TO_REGIONAL: Record<RegionCode, RegionalEngineCode> = { EN: "GLOBAL", TR: "TR", DE: "DE" };

export function isRegionalEngineCode(value: string): value is RegionalEngineCode {
  return (REGIONAL_ENGINE_CODES as readonly string[]).includes(value);
}

export function getRegionConfig(regionCode: RegionalEngineCode): RegionalConfig {
  return REGION_CONFIGS[regionCode];
}

export function resolveRegionalCodeFromLocale(localeInput: string): RegionalEngineCode {
  return LOCALE_TO_REGIONAL[normalizeLocale(localeInput)];
}

export function resolveRegionalCodeFromCompliance(region: RegionCode): RegionalEngineCode {
  return COMPLIANCE_TO_REGIONAL[region];
}

export function resolveRegionalCode(options: { readonly locale?: string; readonly regionCode?: RegionalEngineCode; readonly complianceRegion?: RegionCode }): RegionalEngineCode {
  if (options.regionCode && isRegionalEngineCode(options.regionCode)) return options.regionCode;
  if (options.complianceRegion) return resolveRegionalCodeFromCompliance(options.complianceRegion);
  if (options.locale) return resolveRegionalCodeFromLocale(options.locale);
  return "GLOBAL";
}

export function mapLocaleAndComplianceToRegional(locale: string, complianceRegion?: RegionCode | null): RegionalEngineCode {
  if (complianceRegion) {
    const mapped = resolveRegionalCodeFromCompliance(complianceRegion);
    if (mapped !== "GLOBAL" || complianceRegion === "EN") return mapped;
  }
  return resolveRegionalCodeFromLocale(locale);
}

export function getDefaultLocaleForRegion(regionCode: RegionalEngineCode): SupportedLocale {
  return getRegionConfig(regionCode).defaultLocale;
}

export function getDefaultCurrencyForRegion(regionCode: RegionalEngineCode): RegionalConfig["defaultCurrency"] {
  return getRegionConfig(regionCode).defaultCurrency;
}

export function getDefaultUnitSystemForRegion(regionCode: RegionalEngineCode): RegionalConfig["defaultUnitSystem"] {
  return getRegionConfig(regionCode).defaultUnitSystem;
}

export function resolveRegionalCodeFromLegacy(locale: string, manualComplianceRegion?: string | null): RegionalEngineCode {
  const compliance = manualComplianceRegion && (manualComplianceRegion === "TR" || manualComplianceRegion === "DE" || manualComplianceRegion === "EN")
    ? manualComplianceRegion
    : localeToRegion(locale);
  return mapLocaleAndComplianceToRegional(locale, compliance);
}
