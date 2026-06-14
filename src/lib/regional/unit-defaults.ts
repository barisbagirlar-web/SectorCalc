/**
 * P25 — Calculator surface unit + currency defaults (display/selector layer).
 * Formula inputs stay canonical; conversion is display-only unless explicitly wired.
 */

import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import type { UnitSystemPreference } from "@/config/measurement";
import {
  getAvailableUnitsForQuantity,
  getDefaultDisplayUnitForQuantity,
  mapDimensionToQuantityType,
  mapFieldKeyToQuantityType,
} from "@/lib/regional/unit-systems";
import {
  getDefaultCurrencyForRegion as getRegionDefaultCurrency,
  resolveRegionalCodeFromLocale,
} from "@/lib/regional/regions";
import type { RegionalEngineCode } from "@/lib/regional/types";

export type UnitGroup =
  | "length"
  | "area"
  | "volume"
  | "weight"
  | "mass"
  | "time"
  | "speed"
  | "temperature"
  | "pressure"
  | "power"
  | "energy"
  | "currency"
  | "percentage"
  | "count"
  | "density"
  | "flow"
  | "torque"
  | "force"
  | "fuel";

type QuantityType =
  | "length"
  | "area"
  | "volume"
  | "mass"
  | "time"
  | "speed"
  | "temperature"
  | "power"
  | "energy"
  | "currency"
  | "percentage"
  | "count"
  | "flowRate";

const UNIT_GROUP_TO_QUANTITY: Partial<Record<UnitGroup, QuantityType>> = {
  length: "length",
  area: "area",
  volume: "volume",
  weight: "mass",
  mass: "mass",
  time: "time",
  speed: "speed",
  temperature: "temperature",
  power: "power",
  energy: "energy",
  currency: "currency",
  percentage: "percentage",
  count: "count",
  flow: "flowRate",
  fuel: "volume",
};

const UNIT_LABEL_TR: Record<string, string> = {
  mm: "mm",
  cm: "cm",
  m: "m",
  km: "km",
  in: "in",
  ft: "ft",
  yd: "yd",
  mi: "mi",
  m2: "m²",
  ft2: "ft²",
  sqft: "ft²",
  acre: "dönüm",
  hectare: "hektar",
  L: "litre",
  l: "litre",
  ml: "ml",
  m3: "m³",
  gal: "galon",
  ft3: "ft³",
  cuft: "ft³",
  g: "g",
  kg: "kg",
  tonne: "ton",
  lb: "lb",
  oz: "oz",
  kWh: "kWh",
  MWh: "MWh",
  kW: "kW",
  W: "W",
  MW: "MW",
  hp: "hp",
  C: "°C",
  F: "°F",
  TRY: "TRY",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  AED: "AED",
  SAR: "SAR",
  QAR: "QAR",
  KWD: "KWD",
  CAD: "CAD",
  AUD: "AUD",
  CHF: "CHF",
  JPY: "JPY",
  "%": "%",
  min: "dk",
  h: "sa",
  hr: "sa",
};

function resolveRegion(region: string): RegionalEngineCode {
  const upper = region.toUpperCase();
  if (upper === "TR" || upper === "US" || upper === "DE" || upper === "FR" || upper === "ES" || upper === "AR") {
    return upper as RegionalEngineCode;
  }
  if (upper === "GB" || upper === "UK") {
    return "GLOBAL";
  }
  if (upper === "AE" || upper === "SA" || upper === "QA" || upper === "KW") {
    return "AR";
  }
  if (upper === "CA" || upper === "AU" || upper === "CH" || upper === "JP") {
    return "GLOBAL";
  }
  return resolveRegionalCodeFromLocale(region);
}

export function resolveRegionalCodeForUnitDefaults(
  locale: string,
  unitSystem?: UnitSystemPreference | null,
): RegionalEngineCode {
  if (unitSystem === "imperial") {
    return "US";
  }
  return resolveRegionalCodeFromLocale(locale);
}

export function getDefaultCurrencyForRegion(region: string): string {
  return getRegionDefaultCurrency(resolveRegion(region));
}

export function getDefaultUnitForRegion(
  region: string,
  group: UnitGroup,
  unitSystem?: UnitSystemPreference | null,
): string {
  const quantity = UNIT_GROUP_TO_QUANTITY[group];
  if (!quantity) {
    return group === "currency" ? getDefaultCurrencyForRegion(region) : "m";
  }
  const effectiveRegion: RegionalEngineCode =
    unitSystem === "imperial" ? "US" : resolveRegion(region);
  return getDefaultDisplayUnitForQuantity(quantity, effectiveRegion);
}

export function getAvailableUnitsForGroup(
  group: UnitGroup,
  locale: string,
  unitSystem?: UnitSystemPreference | null,
): Array<{ value: string; label: string }> {
  const quantity = UNIT_GROUP_TO_QUANTITY[group];
  if (!quantity) {
    return [];
  }
  const region = resolveRegionalCodeForUnitDefaults(locale, unitSystem);
  return getAvailableUnitsForQuantity(quantity, region).map((value) => ({
    value,
    label: localizeUnitSymbol(value, locale),
  }));
}

export function localizeUnitSymbol(symbol: string, locale: string): string {
  if (locale === "tr" && UNIT_LABEL_TR[symbol]) {
    return UNIT_LABEL_TR[symbol];
  }
  return symbol;
}

export function inferUnitGroupFromFieldKey(fieldKey: string, dimension?: string): UnitGroup | null {
  const fromDimension = dimension ? mapDimensionToQuantityType(dimension) : null;
  if (fromDimension) {
    const entry = Object.entries(UNIT_GROUP_TO_QUANTITY).find(([, q]) => q === fromDimension);
    return (entry?.[0] as UnitGroup | undefined) ?? null;
  }
  const quantity = mapFieldKeyToQuantityType(fieldKey, dimension ?? "");
  if (!quantity) {
    return null;
  }
  const entry = Object.entries(UNIT_GROUP_TO_QUANTITY).find(([, q]) => q === quantity);
  return (entry?.[0] as UnitGroup | undefined) ?? null;
}

export function getCurrencyOptionsForLocale(locale: string): Array<{ value: string; label: string }> {
  const region = resolveRegionalCodeFromLocale(locale);
  return getAvailableUnitsForQuantity("currency", region).map((value) => ({
    value,
    label: value,
  }));
}

export function localizedUnitAriaLabel(locale: string): string {
  return translateCalculatorPhrase("Unit", locale);
}
