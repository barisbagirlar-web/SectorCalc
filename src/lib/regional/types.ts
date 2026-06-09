/**
 * Regional Unit & Parameter Engine — shared types.
 */

import type { SupportedLocale } from "@/lib/i18n/locale-config";

export type RegionalEngineCode = "GLOBAL" | "TR" | "US" | "DE" | "FR" | "ES" | "AR";
export type MeasurementSystem = "metric" | "imperial" | "us_customary";
export type UnitSystemId = "metric" | "imperial";
export type QuantityType =
  | "length" | "area" | "volume" | "mass" | "time" | "currency" | "energy" | "power"
  | "temperature" | "flowRate" | "speed" | "percentage" | "count";
export type RegionalCurrencyCode = "USD" | "EUR" | "TRY" | "GBP" | "SAR" | "AED";
export type RegionalParameterStatus = "configured" | "global_default" | "not_configured";

export type RegionalParameterResult<T = number | string> = {
  readonly value: T;
  readonly unit?: string;
  readonly source: string;
  readonly confidence: "high" | "medium" | "low";
  readonly version: string;
  readonly effectiveFrom?: string;
  readonly status: RegionalParameterStatus;
};

export type RegionalConfig = {
  readonly regionCode: RegionalEngineCode;
  readonly label: string;
  readonly defaultLocale: SupportedLocale;
  readonly defaultCurrency: RegionalCurrencyCode;
  readonly defaultUnitSystem: UnitSystemId;
  readonly decimalSeparator: string;
  readonly thousandSeparator: string;
  readonly dateFormat: string;
  readonly measurementSystem: MeasurementSystem;
  readonly supportedUnitSystems: readonly UnitSystemId[];
  readonly notes?: string;
};

export type RegionalCalculationContext = {
  readonly locale: SupportedLocale;
  readonly regionCode: RegionalEngineCode;
  readonly config: RegionalConfig;
  readonly currency: RegionalCurrencyCode;
  readonly unitSystem: UnitSystemId;
  readonly numberLocale: string;
  readonly dateLocale: string;
  readonly toolSlug?: string;
};

export type NormalizeInputValueInput = {
  readonly value: number;
  readonly unit: string;
  readonly quantityType: QuantityType;
};

export type NormalizeInputValueResult =
  | { readonly ok: true; readonly canonicalValue: number; readonly canonicalUnit: string; readonly quantityType: QuantityType }
  | { readonly ok: false; readonly reason: "unknown_unit" | "incompatible_units" | "non_finite" | "unsupported_quantity" };

export type FormatOutputValueInput = {
  readonly canonicalValue: number;
  readonly quantityType: QuantityType;
  readonly targetUnit?: string;
  readonly locale: SupportedLocale;
  readonly currency?: RegionalCurrencyCode;
  readonly maximumFractionDigits?: number;
};

export type FormatOutputValueResult = {
  readonly formatted: string;
  readonly displayUnit: string;
  readonly currency?: RegionalCurrencyCode;
};

export type RegionalSmartFormInputExtension = {
  readonly quantityType?: QuantityType;
  readonly unitOptions?: readonly { readonly value: string; readonly label: string }[];
  readonly defaultUnit?: string;
  readonly selectedUnit?: string;
  readonly canonicalUnit?: string;
  readonly regionalSource?: RegionalEngineCode;
  readonly displayFormat?: "number" | "currency" | "percent" | "unit";
};
