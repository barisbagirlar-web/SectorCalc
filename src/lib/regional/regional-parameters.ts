import type { QuantityType, RegionalEngineCode, RegionalParameterResult } from "@/lib/regional/types";
import { getDefaultCurrency, getRegionalFormatDefaults } from "@/lib/regional/regional-defaults";
import { getAvailableUnitsForQuantity } from "@/lib/regional/unit-systems";

const VAT_LABEL_BY_REGION: Record<RegionalEngineCode, string> = { GLOBAL: "VAT", TR: "KDV", US: "Sales tax", DE: "MwSt.", FR: "TVA", ES: "IVA", AR: "VAT" };

export function getRegionalParameterOptions(options: { readonly toolSlug: string; readonly parameterKey: string; readonly regionCode: RegionalEngineCode }): RegionalParameterResult<string | readonly string[]> {
  const normalized = options.parameterKey.toLowerCase();
  if (normalized === "currency" || normalized.includes("currency")) {
    return { value: getAvailableUnitsForQuantity("currency", options.regionCode), source: "regional-parameters.currency-options", confidence: "high", version: "1.0.0", status: "configured" };
  }
  const quantityType = inferQuantityTypeFromParameterKey(options.parameterKey);
  if ((normalized === "unit" || normalized.includes("unit")) && quantityType) {
    return { value: getAvailableUnitsForQuantity(quantityType, options.regionCode), unit: quantityType, source: "regional-parameters.unit-options", confidence: "high", version: "1.0.0", status: "configured" };
  }
  if (normalized === "vatlabel" || normalized === "taxlabel") {
    return { value: VAT_LABEL_BY_REGION[options.regionCode], source: "regional-parameters.vat-label", confidence: "high", version: "1.0.0", status: "configured" };
  }
  if (normalized === "dateformat") {
    return { value: getRegionalFormatDefaults(options.regionCode).dateFormat, source: "regional-parameters.date-format", confidence: "high", version: "1.0.0", status: "configured" };
  }
  return { value: "", source: "regional-parameters.not-configured", confidence: "low", version: "1.0.0", status: "not_configured" };
}

export function getRegionalBenchmark(options: { readonly benchmarkKey: string; readonly regionCode: RegionalEngineCode }): RegionalParameterResult<number> {
  void options;
  return { value: 0, source: "regional-parameters.benchmark-not-configured", confidence: "low", version: "1.0.0", status: "not_configured" };
}

export function getRegionalCurrencyDefault(regionCode: RegionalEngineCode): RegionalParameterResult<string> {
  const currency = getDefaultCurrency(regionCode);
  return { value: currency, unit: currency, source: regionCode === "GLOBAL" ? "regional-parameters.global-default-currency" : "regional-parameters.region-currency", confidence: "high", version: "1.0.0", status: regionCode === "GLOBAL" ? "global_default" : "configured" };
}

function inferQuantityTypeFromParameterKey(parameterKey: string): QuantityType | null {
  const n = parameterKey.toLowerCase();
  if (n.includes("length")) return "length";
  if (n.includes("area")) return "area";
  if (n.includes("mass") || n.includes("weight")) return "mass";
  if (n.includes("percent")) return "percentage";
  return null;
}
