/**
 * Measurement system preference — geo-detected defaults with optional manual override.
 */

export const UNIT_SYSTEM_COOKIE = "sc-unit-system";
export const UNIT_SYSTEM_MANUAL_COOKIE = "sc-unit-system-manual";
export const UNIT_SYSTEM_HEADER = "x-unit-system";

export type UnitSystemPreference = "metric" | "imperial";

const IMPERIAL_COUNTRY_CODES = new Set(["US", "GB", "UK", "LR", "MM"]);

export function isUnitSystemPreference(
  value: string | undefined | null,
): value is UnitSystemPreference {
  return value === "metric" || value === "imperial";
}

/** ISO 3166-1 alpha-2 → preferred measurement system for calculator defaults. */
export function detectUnitSystemFromCountry(
  country: string | null | undefined,
): UnitSystemPreference {
  if (!country) {
    return "metric";
  }
  return IMPERIAL_COUNTRY_CODES.has(country.toUpperCase()) ? "imperial" : "metric";
}

export function resolveUnitSystemPreference(options: {
  readonly manual?: string | null;
  readonly cookie?: string | null;
  readonly country?: string | null;
}): UnitSystemPreference {
  if (isUnitSystemPreference(options.manual)) {
    return options.manual;
  }
  if (isUnitSystemPreference(options.cookie)) {
    return options.cookie;
  }
  return detectUnitSystemFromCountry(options.country);
}
