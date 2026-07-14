// SectorCalc SuperV4 V5.3 Unit Normalizer
// Converts display values to normalized base-unit values for server-side execution.

import type { ConversionRegistry, ConversionEntry } from "./contract-types";
import Big from "big.js";

type DecimalInput = string | number;

export interface NormalizedValue {
  baseValue: number;
  exactBaseValue: string;
  baseUnit: string;
  quantityKind: string;
}

export interface ConversionError {
  inputId: string;
  reason: string;
}

function convertWithDecimal(
  value: DecimalInput,
  fromEntry: ConversionEntry,
  toEntry: ConversionEntry,
): { ok: true; value: number; exactValue: string } | { ok: false; reason: string } {
  const DecimalConstructor = Big();
  DecimalConstructor.DP = 50;
  DecimalConstructor.RM = 2;
  DecimalConstructor.STRICT = true;

  try {
    const display = DecimalConstructor(String(value));
    const fromFactor = DecimalConstructor(String(fromEntry.factor));
    const registryBase = fromEntry.offset !== undefined
      ? display
          .minus(DecimalConstructor(String(fromEntry.offset)))
          .div(fromFactor)
      : display.times(fromFactor);
    const toFactor = DecimalConstructor(String(toEntry.factor));
    const converted = toEntry.offset !== undefined
      ? registryBase
          .times(toFactor)
          .plus(DecimalConstructor(String(toEntry.offset)))
      : registryBase.div(toFactor);
    const presentationValue = Number(converted.toString());
    return Number.isFinite(presentationValue)
      ? { ok: true, value: presentationValue, exactValue: converted.toString() }
      : { ok: false, reason: "Converted value exceeds the JSON numeric range." };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error
        ? error.message
        : "Decimal unit conversion failed.",
    };
  }
}

/**
 * Normalize a unit registry entry that may be in either array form (format A)
 * or flat-object form (format B) into a safe ConversionEntry array.
 *
 * Format A (array):
 *   { base_unit: "W", units: [{ unit: "W", factor: 1 }, { unit: "kW", factor: 1000 }] }
 *
 * Format B (flat-object, used by existing Pro schemas):
 *   { "W": { factor: 1, offset: 0 }, "kW": { factor: 1000, offset: 0 } }
 *
 * Returns a safe array of ConversionEntry.
 */
export function normalizeUnitRegistryEntry(
  entry: Record<string, unknown>,
): ConversionEntry[] {
  // Format A: has a "units" array
  if (Array.isArray(entry.units)) {
    return entry.units as ConversionEntry[];
  }

  // Format B: keys are unit names, values are { factor, offset? }
  const units: ConversionEntry[] = [];
  for (const [unitName, unitValue] of Object.entries(entry)) {
    if (unitName === "base_unit" || unitName === "unit_family") continue;
    if (!unitValue || typeof unitValue !== "object") continue;
    const uv = unitValue as Record<string, unknown>;
    if (typeof uv.factor !== "number") continue;
    units.push({
      unit: unitName,
      factor: uv.factor,
      offset: typeof uv.offset === "number" ? uv.offset : undefined,
      label: typeof uv.label === "string" ? uv.label : undefined,
    });
  }

  return units;
}

export function normalizeInput(
  inputId: string,
  displayValue: DecimalInput,
  displayUnit: string,
  baseUnit: string,
  quantityKind: string,
  registry: ConversionRegistry,
): NormalizedValue | ConversionError {
  if (typeof displayValue === "number" && !Number.isFinite(displayValue)) {
    return {
      inputId,
      reason: "Display value must be finite before unit normalization.",
    };
  }
  // Fast path: when display unit matches the base unit, no conversion needed.
  // This also handles missing registry entries for quantity kinds whose base
  // and display values are identical (e.g. dimensionless inputs with count units).
  if (displayUnit === baseUnit) {
    const identity = convertWithDecimal(
      displayValue,
      { unit: displayUnit, factor: 1 },
      { unit: baseUnit, factor: 1 },
    );
    if (!identity.ok) return { inputId, reason: identity.reason };
    return {
      baseValue: identity.value,
      exactBaseValue: identity.exactValue,
      baseUnit,
      quantityKind,
    };
  }

  const entry = registry[quantityKind];
  if (!entry) {
    return {
      inputId,
      reason: `No conversion registry entry for quantity kind: ${quantityKind}`,
    };
  }

  const safeUnits = normalizeUnitRegistryEntry(entry as unknown as Record<string, unknown>);
  const fromEntry = safeUnits.find((u: ConversionEntry) => u.unit === displayUnit);
  if (!fromEntry) {
    return {
      inputId,
      reason: `Unknown display unit "${displayUnit}" for ${quantityKind}`,
    };
  }

  const toEntry = safeUnits.find((u: ConversionEntry) => u.unit === baseUnit);
  if (!toEntry) {
    return {
      inputId,
      reason: `Unknown base unit "${baseUnit}" for ${quantityKind}`,
    };
  }

  const conversion = convertWithDecimal(displayValue, fromEntry, toEntry);
  if (!conversion.ok) {
    return {
      inputId,
      reason: conversion.reason,
    };
  }

  return {
    baseValue: conversion.value,
    exactBaseValue: conversion.exactValue,
    baseUnit,
    quantityKind,
  };
}

export function normalizeInputs(
  rawInputs: Record<string, DecimalInput>,
  selectedUnits: Record<string, string>,
  schema: {
    inputs: Array<{
      id: string;
      quantity_kind: string;
      base_unit: string | null;
    }>;
  },
  registry: ConversionRegistry,
): { normalized: Record<string, NormalizedValue>; errors: ConversionError[] } {
  const normalized: Record<string, NormalizedValue> = {};
  const errors: ConversionError[] = [];

  for (const inp of schema.inputs) {
    const rawValue = rawInputs[inp.id];
    if (rawValue === undefined || rawValue === null) continue;

    const displayUnit = selectedUnits[inp.id] || inp.base_unit || "";
    const baseUnit = inp.base_unit || displayUnit;

    const result = normalizeInput(
      inp.id,
      rawValue,
      displayUnit,
      baseUnit,
      inp.quantity_kind,
      registry,
    );

    if ("baseValue" in result) {
      normalized[inp.id] = result;
    } else {
      errors.push(result);
    }
  }

  return { normalized, errors };
}

export function preservePhysicalQuantity(
  oldValue: number,
  oldUnit: string,
  newUnit: string,
  quantityKind: string,
  registry: ConversionRegistry,
): { newValue: number } | ConversionError {
  if (!Number.isFinite(oldValue)) {
    return {
      inputId: quantityKind,
      reason: "Value must be finite before preserving physical quantity.",
    };
  }
  // Convert oldValue from oldUnit to newUnit (preserving physical quantity)
  const entry = registry[quantityKind];
  if (!entry) {
    return {
      inputId: quantityKind,
      reason: `No conversion registry for quantity kind: ${quantityKind}`,
    };
  }

  const safeUnits = normalizeUnitRegistryEntry(entry as unknown as Record<string, unknown>);
  const oldEntry = safeUnits.find((u: ConversionEntry) => u.unit === oldUnit);
  const newEntry = safeUnits.find((u: ConversionEntry) => u.unit === newUnit);

  if (!oldEntry) {
    return { inputId: oldUnit, reason: `Unknown unit: ${oldUnit}` };
  }
  if (!newEntry) {
    return { inputId: newUnit, reason: `Unknown unit: ${newUnit}` };
  }

  const conversion = convertWithDecimal(oldValue, oldEntry, newEntry);
  return conversion.ok
    ? { newValue: conversion.value }
    : { inputId: quantityKind, reason: conversion.reason };
}
