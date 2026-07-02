export type RegionCode = "TR" | "DE" | "EN";

export const REGION_COOKIE = "sc-region";
/** User explicitly chose a region (overrides locale default until cleared). */
export const REGION_MANUAL_COOKIE = "sc-region-manual";
export const REGION_HEADER = "x-region";
export const REGION_SOURCE_HEADER = "x-region-source";

export const SUPPORTED_REGIONS: readonly RegionCode[] = ["TR", "DE", "EN"] as const;

export interface RegionalComplianceProfile {
  readonly code: RegionCode;
  readonly label: string;
  readonly currency: string;
  // readonly defaultL_ocale: string;
  /** Macro inflation overlay applied to hidden-loss projections */
  readonly inflationCoefficient: number;
  /** Standard VAT / sales tax rate */
  readonly vatRate: number;
  /** Peak-load energy tariff multiplier (TR: high/low load) */
  readonly energyPeakMultiplier: number;
  readonly energyOffPeakMultiplier: number;
  /** Weight applied to energy-driven hidden loss modules */
  readonly hiddenLossEnergyWeight: number;
  /** Combined fiscal / payroll tax coefficient */
  readonly taxCoefficient: number;
  /** CBAM active for this jurisdiction */
  readonly cbamEnabled: boolean;
  /** EU ETS reference carbon price (EUR/tCO₂e) */
  readonly cbamCarbonPriceEur: number;
  /** EU industrial efficiency factor */
  readonly euIndustrialEfficiencyFactor: number;
  /** Industrial electricity unit cost (USD/kWh equivalent) */
  readonly electricityCostPerKwh: number;
  /** CBAM exposure index override for EU regions */
  readonly cbamExposureBoost: number;
}

export const REGION_PROFILES: Record<RegionCode, RegionalComplianceProfile> = {
  TR: {
    code: "TR",
    label: "Turkey",
    currency: "TRY",
    
    inflationCoefficient: 1.52,
    vatRate: 0.2,
    energyPeakMultiplier: 1.85,
    energyOffPeakMultiplier: 1.0,
    hiddenLossEnergyWeight: 1.35,
    taxCoefficient: 1.2,
    cbamEnabled: false,
    cbamCarbonPriceEur: 0,
    euIndustrialEfficiencyFactor: 1.0,
    electricityCostPerKwh: 0.12,
    cbamExposureBoost: 0,
  },
  DE: {
    code: "DE",
    label: "Germany",
    currency: "EUR",
    
    inflationCoefficient: 1.08,
    vatRate: 0.19,
    energyPeakMultiplier: 1.15,
    energyOffPeakMultiplier: 0.92,
    hiddenLossEnergyWeight: 1.0,
    taxCoefficient: 1.19,
    cbamEnabled: true,
    cbamCarbonPriceEur: 85,
    euIndustrialEfficiencyFactor: 1.12,
    electricityCostPerKwh: 0.25,
    cbamExposureBoost: 0.25,
  },
  EN: {
    code: "EN",
    label: "Global",
    currency: "USD",
    
    inflationCoefficient: 1.0,
    vatRate: 0,
    energyPeakMultiplier: 1.0,
    energyOffPeakMultiplier: 1.0,
    hiddenLossEnergyWeight: 1.0,
    taxCoefficient: 1.0,
    cbamEnabled: false,
    cbamCarbonPriceEur: 55,
    euIndustrialEfficiencyFactor: 1.0,
    electricityCostPerKwh: 0.15,
    cbamExposureBoost: 0,
  },
};

const COUNTRY_TO_REGION: Record<string, RegionCode> = {
  TR: "TR",
  DE: "DE",
};

export function isRegionCode(value: string): value is RegionCode {
  return value === "TR" || value === "DE" || value === "EN";
}

/** Map ISO 3166-1 alpha-2 country → region. Unknown → EN (Global). */
export function countryToRegion(country: string | null | undefined): RegionCode {
  if (!country) {
    return "EN";
  }
  return COUNTRY_TO_REGION[country.toUpperCase()] ?? "EN";
}

export function getRegionProfile(region: RegionCode): RegionalComplianceProfile {
  return REGION_PROFILES[region];
}

/** Prefer explicit region; else map locale prefix to region. */
export function localeToRegion(locale: string): RegionCode {
  const base = locale.split("-")[0]?.toLowerCase();
  if (base === "de") return "DE";
  return "EN";
}

/** Active region: manual override → locale mapping (language drives currency). */
export function resolveActiveRegion(
  manualOverride: string | undefined | null,
  locale: string,
): RegionCode {
  if (manualOverride && isRegionCode(manualOverride)) {
    return manualOverride;
  }
  return localeToRegion(locale);
}

/** @deprecated Geo fallback — prefer resolveActiveRegion(manual, locale). */
export function resolveRegion(
  explicit: RegionCode | undefined,
  locale: string,
  detectedCountry?: string | null,
): RegionCode {
  if (explicit && isRegionCode(explicit)) {
    return explicit;
  }
  if (detectedCountry) {
    return countryToRegion(detectedCountry);
  }
  return localeToRegion(locale);
}

export function regionalFormatLocale(region: RegionCode, locale: string): string {
  if (region === "TR") {
    return "tr-TR";
  }
  if (region === "DE") {
    return "de-DE";
  }
  const base = locale.split("-")[0]?.toLowerCase();
  if (base === "en") {
    return "en-US";
  }
  if (base === "es") {
    return "es-ES";
  }
  if (base === "ar") {
    return "ar-SA";
  }
  return locale.includes("-") ? locale : "en-US";
}
