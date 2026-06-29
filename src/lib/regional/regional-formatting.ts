import { LOCALE_DEFINITIONS } from "@/lib/i18n/locale-config";
import { normalizeLocale } from "@/lib/format/localization";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { getDefaultCurrency, getRegionalFormatDefaults } from "@/lib/regional/regional-defaults";
import { denormalizeOutputValue } from "@/lib/regional/unit-conversions";
import { getDefaultDisplayUnitForQuantity } from "@/lib/regional/unit-systems";
import type { FormatOutputValueInput, FormatOutputValueResult, RegionalCurrencyCode, RegionalEngineCode } from "@/lib/regional/types";

function resolveRegionFromLocale(locale: SupportedLocale): RegionalEngineCode {
  const map: Record<string, RegionalEngineCode> = { en: "GLOBAL", tr: "TR", de: "DE", fr: "FR", es: "ES", ar: "AR" };
  return map[locale] ?? "GLOBAL";
}

export function formatOutputValue(input: FormatOutputValueInput): FormatOutputValueResult {
  const locale = normalizeLocale(input.locale);
  const numberLocale = LOCALE_DEFINITIONS[locale].numberLocale;
  if (input.quantityType === "currency") {
    const currency = input.currency ?? getDefaultCurrency(resolveRegionFromLocale(locale));
    return { formatted: new Intl.NumberFormat(numberLocale, { style: "currency", currency, maximumFractionDigits: input.maximumFractionDigits ?? 2 }).format(input.canonicalValue), displayUnit: currency, currency };
  }
  if (input.quantityType === "percentage") {
    const formatted = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: input.maximumFractionDigits ?? 1 }).format(input.canonicalValue);
    return { formatted: `${formatted}%`, displayUnit: "%" };
  }
  const targetUnit = input.targetUnit ?? getDefaultDisplayUnitForQuantity(input.quantityType, resolveRegionFromLocale(locale));
  const denormalized = denormalizeOutputValue({ canonicalValue: input.canonicalValue, quantityType: input.quantityType, targetUnit });
  const displayValue = denormalized.ok ? denormalized.canonicalValue : input.canonicalValue;
  const displayUnit = denormalized.ok ? denormalized.canonicalUnit : targetUnit;
  const formatted = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: input.maximumFractionDigits ?? 2 }).format(displayValue);
  return { formatted: displayUnit && displayUnit !== "count" ? `${formatted} ${displayUnit}` : formatted, displayUnit };
}

export function formatRegionalCurrency(value: number, locale: SupportedLocale, regionCode: RegionalEngineCode, currency?: RegionalCurrencyCode): string {
  const code = currency ?? getDefaultCurrency(regionCode);
  const numberLocale = LOCALE_DEFINITIONS[normalizeLocale(locale)].numberLocale;
  try {
    return new Intl.NumberFormat(numberLocale, { style: "currency", currency: code, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${code} ${new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2 }).format(value)}`;
  }
}

export function getLocaleDecimalSeparator(locale: SupportedLocale): string {
  return getRegionalFormatDefaults(resolveRegionFromLocale(locale)).decimalSeparator;
}
