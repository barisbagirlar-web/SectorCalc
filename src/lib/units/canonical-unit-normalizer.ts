/**
 * Canonical unit normalization — ADIM 5 regional unit motor (metadata + conversion layer).
 */

import { normalizeLocale } from "@/lib/format/localization";
import {
  getCanonicalUnitDefinition,
  getPreferredCanonicalUnit,
  lookupCanonicalUnit,
  type CanonicalUnitId,
  type UnitDimension,
  type UnitSystem,
} from "@/lib/units/unit-definitions";
import { isPhysicalDimension, resolveLocaleDefaultUnitSystem } from "@/lib/units/locale-unit-defaults";
import { convertCanonicalUnits, convertUnits, type ConversionResult } from "@/lib/units/unit-conversions";

export type FieldUnitMetadata = {
  readonly canonicalUnit: string;
  readonly displayUnit: string;
  readonly unitSystem: UnitSystem;
  readonly dimension: UnitDimension;
  readonly convertible: boolean;
};

const DIMENSION_ALIASES: Record<string, UnitDimension> = {
  currency: "currency",
  percent: "percent",
  count: "count",
  time: "time",
  length: "length",
  area: "area",
  volume: "volume",
  mass: "mass",
  temperature: "temperature",
  rate: "rate",
  dimensionless: "dimensionless",
};

const FIELD_DIMENSION_HINTS: readonly { readonly dimension: UnitDimension; readonly hints: readonly string[] }[] = [
  { dimension: "area", hints: ["area", "square", "sqft", "acre"] },
  { dimension: "length", hints: ["length", "height", "width", "depth", "feet", "foot", "inch", "yard", "mile"] },
  { dimension: "volume", hints: ["volume", "gallon", "cubic", "cuft"] },
  { dimension: "mass", hints: ["weight", "pound", "mass", "kilogram"] },
  { dimension: "temperature", hints: ["temperature", "celsius", "fahrenheit"] },
  { dimension: "rate", hints: ["speed", "mph", "kph"] },
];

function inferDimensionFromFieldKey(fieldKey: string): UnitDimension | null {
  const normalized = fieldKey.toLowerCase();
  for (const entry of FIELD_DIMENSION_HINTS) {
    if (entry.hints.some((hint) => normalized.includes(hint))) {
      return entry.dimension;
    }
  }
  return null;
}

function normalizeDimension(rawDimension: string, fieldKey: string): UnitDimension {
  const mapped = DIMENSION_ALIASES[rawDimension];
  if (mapped && mapped !== "dimensionless") {
    return mapped;
  }

  return inferDimensionFromFieldKey(fieldKey) ?? mapped ?? "dimensionless";
}

function resolveCanonicalUnitId(
  rawUnit: string | undefined,
  dimension: UnitDimension,
): CanonicalUnitId | null {
  if (isPhysicalDimension(dimension)) {
    return getPreferredCanonicalUnit(dimension, "metric");
  }

  const lookedUp = lookupCanonicalUnit(rawUnit);
  if (lookedUp) {
    return lookedUp.id;
  }

  if (dimension === "currency") {
    return "USD";
  }
  if (dimension === "percent") {
    return "percent";
  }
  if (dimension === "count") {
    return "count";
  }
  if (dimension === "time") {
    return rawUnit?.toLowerCase().includes("min") ? "min" : "hr";
  }
  if (dimension === "dimensionless") {
    return "value";
  }

  return null;
}

export function normalizeToCanonicalUnit(
  rawUnit: string | undefined,
  rawDimension: string,
  fieldKey = "",
): { readonly unitId: CanonicalUnitId; readonly symbol: string; readonly dimension: UnitDimension } | null {
  const dimension = normalizeDimension(rawDimension, fieldKey);
  const unitId = resolveCanonicalUnitId(rawUnit, dimension);
  if (!unitId) {
    return null;
  }

  const definition = getCanonicalUnitDefinition(unitId);
  return {
    unitId,
    symbol: definition.symbol,
    dimension,
  };
}

export function resolveFieldUnitMetadata(
  fieldKey: string,
  rawUnit: string | undefined,
  rawDimension: string,
  localeInput?: string,
): FieldUnitMetadata | null {
  const locale = normalizeLocale(localeInput);
  const dimension = normalizeDimension(rawDimension, fieldKey);
  const canonical = normalizeToCanonicalUnit(rawUnit, dimension, fieldKey);
  if (!canonical) {
    return null;
  }

  const unitSystem = resolveLocaleDefaultUnitSystem(locale, fieldKey, dimension);
  const preferredDisplayId = getPreferredCanonicalUnit(dimension, unitSystem);
  const displayId =
    preferredDisplayId && preferredDisplayId !== canonical.unitId && isConvertible(canonical.unitId, preferredDisplayId)
      ? preferredDisplayId
      : canonical.unitId;

  const displayDefinition = getCanonicalUnitDefinition(displayId);

  return {
    canonicalUnit: canonical.symbol,
    displayUnit: displayDefinition.symbol,
    unitSystem,
    dimension,
    convertible: displayId !== canonical.unitId,
  };
}

function isConvertible(fromUnit: CanonicalUnitId, toUnit: CanonicalUnitId): boolean {
  return convertCanonicalUnits(1, fromUnit, toUnit).ok;
}

export function convertValueToCanonical(
  value: number,
  rawUnit: string,
  rawDimension: string,
  fieldKey = "",
): ConversionResult {
  const dimension = normalizeDimension(rawDimension, fieldKey);
  const canonical = normalizeToCanonicalUnit(rawUnit, dimension, fieldKey);
  if (!canonical) {
    return { ok: false, reason: "unknown_unit" };
  }

  const source = lookupCanonicalUnit(rawUnit);
  if (!source) {
    if (isPhysicalDimension(dimension)) {
      return { ok: true, value };
    }
    return { ok: false, reason: "unknown_unit" };
  }

  return convertCanonicalUnits(value, source.id, canonical.unitId);
}

export function convertValueFromCanonical(
  value: number,
  canonicalUnitRaw: string,
  displayUnitRaw: string,
): ConversionResult {
  return convertUnits(value, canonicalUnitRaw, displayUnitRaw);
}

export function resolveDisplayUnitLabel(
  fieldKey: string,
  rawUnit: string | undefined,
  rawDimension: string,
  localeInput?: string,
): string | undefined {
  const metadata = resolveFieldUnitMetadata(fieldKey, rawUnit, rawDimension, localeInput);
  return metadata?.displayUnit ?? rawUnit;
}
