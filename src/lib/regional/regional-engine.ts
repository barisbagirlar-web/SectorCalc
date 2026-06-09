import { LOCALE_DEFINITIONS } from "@/lib/i18n/locale-config";
import { normalizeLocale } from "@/lib/format/localization";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { getRegionConfig, resolveRegionalCode, resolveRegionalCodeFromLegacy } from "@/lib/regional/regions";
import { getDefaultCurrency, getDefaultUnitSystem, resolveLocaleForRegion } from "@/lib/regional/regional-defaults";
import { getRegionalBenchmark, getRegionalParameterOptions } from "@/lib/regional/regional-parameters";
import { formatOutputValue } from "@/lib/regional/regional-formatting";
import { normalizeInputValue } from "@/lib/regional/unit-conversions";
import { getAvailableUnitsForQuantity, getDefaultDisplayUnitForQuantity, mapFieldKeyToQuantityType } from "@/lib/regional/unit-systems";
import type { FormatOutputValueInput, FormatOutputValueResult, NormalizeInputValueInput, NormalizeInputValueResult, RegionalCalculationContext, RegionalEngineCode, RegionalParameterResult, RegionalSmartFormInputExtension } from "@/lib/regional/types";

export { getRegionConfig, resolveRegionalCode, resolveRegionalCodeFromLegacy } from "@/lib/regional/regions";
export { getDefaultUnitSystem, getDefaultCurrency } from "@/lib/regional/regional-defaults";
export { getAvailableUnitsForQuantity, getDefaultDisplayUnitForQuantity, mapFieldKeyToQuantityType } from "@/lib/regional/unit-systems";
export { normalizeInputValue, validateUnitForQuantity } from "@/lib/regional/unit-conversions";
export { formatOutputValue, formatRegionalCurrency } from "@/lib/regional/regional-formatting";
export { getRegionalParameterOptions, getRegionalBenchmark } from "@/lib/regional/regional-parameters";

export function resolveRegionalCalculationContext(options: { readonly locale?: string; readonly regionCode?: RegionalEngineCode; readonly complianceRegion?: string | null; readonly toolSlug?: string }): RegionalCalculationContext {
  const regionCode = options.regionCode ?? resolveRegionalCodeFromLegacy(options.locale ?? "en", options.complianceRegion);
  const locale = resolveLocaleForRegion(regionCode, options.locale);
  const localeDef = LOCALE_DEFINITIONS[locale];
  return { locale, regionCode, config: getRegionConfig(regionCode), currency: getDefaultCurrency(regionCode), unitSystem: getDefaultUnitSystem(regionCode), numberLocale: localeDef.numberLocale, dateLocale: localeDef.dateLocale, toolSlug: options.toolSlug };
}

export function buildRegionalSmartFormExtension(options: { readonly fieldKey: string; readonly dimension: string; readonly context: RegionalCalculationContext; readonly fieldType?: "number" | "currency" | "percent" }): RegionalSmartFormInputExtension {
  const quantityType = options.fieldType === "currency" ? "currency" : options.fieldType === "percent" ? "percentage" : mapFieldKeyToQuantityType(options.fieldKey, options.dimension);
  if (!quantityType) return {};
  const unitOptions = getAvailableUnitsForQuantity(quantityType, options.context.regionCode).map((unit) => ({ value: unit, label: unit }));
  const defaultUnit = getDefaultDisplayUnitForQuantity(quantityType, options.context.regionCode);
  return { quantityType, unitOptions, defaultUnit, selectedUnit: defaultUnit, canonicalUnit: quantityType === "currency" ? options.context.currency : quantityType === "percentage" ? "%" : undefined, regionalSource: options.context.regionCode, displayFormat: options.fieldType === "currency" || quantityType === "currency" ? "currency" : options.fieldType === "percent" ? "percent" : "unit" };
}

export function formatOutputValueForContext(input: Omit<FormatOutputValueInput, "locale"> & { readonly context: RegionalCalculationContext; readonly currency?: FormatOutputValueInput["currency"] }): FormatOutputValueResult {
  return formatOutputValue({ ...input, locale: input.context.locale, currency: input.currency ?? input.context.currency });
}

export function normalizeInputValueForContext(input: NormalizeInputValueInput): NormalizeInputValueResult {
  return normalizeInputValue(input);
}

export function getRegionalParameterOptionsForContext(options: { readonly toolSlug: string; readonly parameterKey: string; readonly context: RegionalCalculationContext }): RegionalParameterResult<string | readonly string[]> {
  return getRegionalParameterOptions({ toolSlug: options.toolSlug, parameterKey: options.parameterKey, regionCode: options.context.regionCode });
}

export function getRegionalBenchmarkForContext(options: { readonly benchmarkKey: string; readonly context: RegionalCalculationContext }): RegionalParameterResult<number> {
  return getRegionalBenchmark({ benchmarkKey: options.benchmarkKey, regionCode: options.context.regionCode });
}

export function resolveLocaleFromContext(context: RegionalCalculationContext): SupportedLocale {
  return normalizeLocale(context.locale);
}
