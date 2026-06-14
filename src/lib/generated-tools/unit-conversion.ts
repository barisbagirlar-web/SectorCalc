import type { GeneratedToolInput } from "@/lib/generated-tools/types";
import {
  getAvailableUnitsForGroup,
  getDefaultUnitForRegion,
  inferUnitGroupFromFieldKey,
  type UnitGroup,
} from "@/lib/regional/unit-defaults";
import { resolveRegionalCodeFromLocale } from "@/lib/regional/regions";
import { convertUnits } from "@/lib/units/unit-conversions";
import { lookupCanonicalUnit } from "@/lib/units/unit-definitions";

const NON_CONVERTIBLE_UNITS = new Set(["%", "units", "count", "ea", "each", "qty"]);

const DIMENSION_TO_UNIT_GROUP: Partial<Record<string, UnitGroup>> = {
  length: "length",
  area: "area",
  volume: "volume",
  mass: "weight",
  temperature: "temperature",
  rate: "speed",
  time: "time",
};

function isCurrencyLikeUnit(unit: string): boolean {
  const normalized = unit.trim().toUpperCase();
  return (
    normalized.includes("/") ||
    normalized.includes("$") ||
    normalized.startsWith("USD") ||
    normalized.startsWith("EUR") ||
    normalized.startsWith("TRY") ||
    normalized.startsWith("GBP")
  );
}

function inferUnitGroupFromSchemaUnit(unit: string): UnitGroup | null {
  const canonical = lookupCanonicalUnit(unit);
  if (!canonical) {
    return null;
  }
  return DIMENSION_TO_UNIT_GROUP[canonical.dimension] ?? null;
}

export function inferGeneratedInputUnitGroup(input: GeneratedToolInput): UnitGroup | null {
  if (input.type !== "number") {
    return null;
  }

  const schemaUnit = input.unit?.trim() ?? "";
  if (schemaUnit && (NON_CONVERTIBLE_UNITS.has(schemaUnit) || isCurrencyLikeUnit(schemaUnit))) {
    return null;
  }

  if (schemaUnit) {
    return inferUnitGroupFromSchemaUnit(schemaUnit) ?? inferUnitGroupFromFieldKey(input.id);
  }

  return inferUnitGroupFromFieldKey(input.id);
}

export function shouldShowGeneratedUnitSelector(input: GeneratedToolInput): boolean {
  return inferGeneratedInputUnitGroup(input) !== null;
}

export function getGeneratedInputUnitOptions(
  input: GeneratedToolInput,
  locale: string,
): readonly { readonly value: string; readonly label: string }[] {
  const group = inferGeneratedInputUnitGroup(input);
  if (!group) {
    return [];
  }
  return getAvailableUnitsForGroup(group, locale);
}

export function buildInitialSelectedUnits(
  inputs: readonly GeneratedToolInput[],
  locale: string,
): Record<string, string> {
  const region = resolveRegionalCodeFromLocale(locale);
  const selected: Record<string, string> = {};

  for (const input of inputs) {
    const group = inferGeneratedInputUnitGroup(input);
    if (!group) {
      continue;
    }

    const options = getAvailableUnitsForGroup(group, locale);
    if (options.length === 0) {
      continue;
    }

    const schemaUnit = input.unit?.trim();
    const regionalDefault = getDefaultUnitForRegion(region, group);
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
