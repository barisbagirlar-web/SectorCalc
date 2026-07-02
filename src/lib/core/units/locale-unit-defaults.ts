/**
 * Locale default unit preferences - ADIM 5 regional unit motor.
 */

import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import type { UnitDimension, UnitSystem } from "@/lib/core/units/unit-definitions";

export const US_IMPERIAL_FIELD_HINTS = [
  "area",
  "square",
  "sqft",
  "length",
  "feet",
  "foot",
  "yard",
  "gallon",
  "gallons",
  "pound",
  "pounds",
  "weight",
  "acre",
  "mile",
  "inches",
  "inch",
  "fahrenheit",
  "sqft",
  "cubicfeet",
  "cubicfoot",
] as const;

const METRIC_DEFAULT_LOCALES: readonly string[] = ["tr", "de", "fr", "es", "ar"];

const PHYSICAL_DIMENSIONS: readonly UnitDimension[] = [
  "length",
  "area",
  "volume",
  "mass",
  "temperature",
  "rate",
];

export function isPhysicalDimension(dimension: UnitDimension): boolean {
  return (PHYSICAL_DIMENSIONS as readonly string[]).includes(dimension);
}

export function isUsImperialField(fieldKey: string): boolean {
  const normalized = fieldKey.toLowerCase();
  return US_IMPERIAL_FIELD_HINTS.some((hint) => normalized.includes(hint));
}

export function resolveLocaleDefaultUnitSystem(
  locale: SupportedLocale,
  fieldKey: string,
  dimension: UnitDimension,
): UnitSystem {
  if (!isPhysicalDimension(dimension)) {
    return "metric";
  }

  if ((METRIC_DEFAULT_LOCALES as readonly string[]).includes(locale)) {
    return "metric";
  }

  if (locale === "en" && isUsImperialField(fieldKey)) {
    return "imperial";
  }

  return "metric";
}
