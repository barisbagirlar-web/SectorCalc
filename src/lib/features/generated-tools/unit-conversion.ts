import type { GeneratedToolInput } from "@/lib/features/generated-tools/types";
import type { UnitSystemPreference } from "@/config/measurement";
import {
  getAvailableUnitsForGroup,
  getDefaultUnitForRegion,
  inferUnitGroupFromFieldKey as inferFieldKeyUnitGroup,
  resolveRegionalCodeForUnitDefaults,
  type UnitGroup,
} from "@/lib/features/regional/unit-defaults";
import { convertUnits } from "@/lib/core/units/unit-conversions";
import { lookupCanonicalUnit } from "@/lib/core/units/unit-definitions";

/** Export renamed for external use */
export { inferFieldKeyUnitGroup as inferUnitGroupFromFieldKey };

const NON_CONVERTIBLE_UNITS = new Set([
  "%",
  "units",
  "count",
  "ea",
  "each",
  "qty",
  "dimensionless",
]);

const DIMENSION_TO_UNIT_GROUP: Partial<Record<string, UnitGroup>> = {
  length: "length",
  area: "area",
  volume: "volume",
  mass: "weight",
  temperature: "temperature",
  rate: "speed",
  time: "time",
};

const CURRENCY_CODES = new Set([
  "USD", "EUR", "TRY", "GBP", "SAR", "AED",
  "CAD", "AUD", "CHF", "JPY", "KWD", "QAR",
]);

function isCurrencyLikeUnit(unit: string): boolean {
  return CURRENCY_CODES.has(unit.trim().toUpperCase());
}

/** Recognise compound currency units like "USD/yil", "EUR/kg", "TRY/saat" */
function isCompoundCurrencyUnit(unit: string): boolean {
  const upper = unit.trim().toUpperCase();
  return [...CURRENCY_CODES].some(
    (code) => upper.startsWith(code + "/") || upper.includes("/" + code),
  );
}

function inferUnitGroupFromSchemaUnit(unit: string): UnitGroup | null {
  const canonical = lookupCanonicalUnit(unit);
  if (!canonical) {
    return null;
  }
  return DIMENSION_TO_UNIT_GROUP[canonical.dimension] ?? null;
}

/**
 * Generic unit-group inference from any unit string + field key.
 * Used by both GeneratedToolInput forms and Premium schema engine.
 */
export function inferInputUnitGroup(
  unit: string,
  fieldKey?: string,
): UnitGroup | null {
  const schemaUnit = unit?.trim() ?? "";
  if (!schemaUnit && !fieldKey) {
    return null;
  }

  // Direct currency match
  if (schemaUnit && isCurrencyLikeUnit(schemaUnit)) {
    return "currency";
  }

  // Compound currency units — not convertible
  if (schemaUnit && isCompoundCurrencyUnit(schemaUnit)) {
    return null;
  }

  // Non-convertible
  if (schemaUnit && NON_CONVERTIBLE_UNITS.has(schemaUnit)) {
    return null;
  }

  // Try canonical unit lookup first
  if (schemaUnit) {
    return inferUnitGroupFromSchemaUnit(schemaUnit) ?? (fieldKey ? inferFieldKeyUnitGroup(fieldKey) : null);
  }

  // Fallback to field key inference
  return fieldKey ? inferFieldKeyUnitGroup(fieldKey) : null;
}

export function inferGeneratedInputUnitGroup(input: GeneratedToolInput): UnitGroup | null {
  if (input.type !== "number") {
    return null;
  }
  return inferInputUnitGroup(input.unit, input.id);
}

export function shouldShowGeneratedUnitSelector(input: GeneratedToolInput): boolean {
  return inferGeneratedInputUnitGroup(input) !== null;
}

export function getGeneratedInputUnitOptions(
  input: GeneratedToolInput,
  locale: string,
  unitSystem?: UnitSystemPreference | null,
): readonly { readonly value: string; readonly label: string }[] {
  const group = inferGeneratedInputUnitGroup(input);
  if (!group) {
    return [];
  }
  return getAvailableUnitsForGroup(group, locale, unitSystem);
}

export function buildInitialSelectedUnits(
  inputs: readonly GeneratedToolInput[],
  locale: string,
  unitSystem?: UnitSystemPreference | null,
): Record<string, string> {
  const region = resolveRegionalCodeForUnitDefaults(locale, unitSystem);
  const selected: Record<string, string> = {};

  for (const input of inputs) {
    const group = inferGeneratedInputUnitGroup(input);
    if (!group) {
      continue;
    }

    const options = getAvailableUnitsForGroup(group, locale, unitSystem);
    if (options.length === 0) {
      continue;
    }

    const schemaUnit = input.unit?.trim();
    const regionalDefault = getDefaultUnitForRegion(region, group, unitSystem);
    const schemaOption = options.find(
      (option) => option.value.toLowerCase() === schemaUnit?.toLowerCase(),
    );
    const regionalOption = options.find((option) => option.value === regionalDefault);

    selected[input.id] = regionalOption?.value ?? schemaOption?.value ?? options[0]?.value ?? schemaUnit ?? "";
  }

  return selected;
}

export function convertGeneratedFormValues(
  inputs: readonly GeneratedToolInput[],
  values: Record<string, unknown>,
  selectedUnits: Record<string, string>,
): Record<string, unknown> {
  const converted: Record<string, unknown> = { ...values };

  for (const input of inputs) {
    if (!shouldShowGeneratedUnitSelector(input)) {
      continue;
    }

    const rawValue = values[input.id];
    if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
      continue;
    }

    const group = inferGeneratedInputUnitGroup(input);

    // For currency fields, skip conversion (no live exchange rates).
    // The value the user enters is in their chosen currency unit.
    if (group === "currency") {
      continue;
    }

    const fromUnit = selectedUnits[input.id]?.trim();
    const toUnit = input.unit?.trim();
    if (!fromUnit || !toUnit) {
      continue;
    }

    if (fromUnit.toLowerCase() === toUnit.toLowerCase()) {
      continue;
    }

    const result = convertUnits(rawValue, fromUnit, toUnit);
    if (result.ok) {
      converted[input.id] = result.value;
    }
  }

  return converted;
}
