// SectorCalc SuperV4 V5.3 Unit Normalizer
// Converts display values to normalized base-unit values for server-side execution.

import type { ConversionRegistry, ConversionEntry } from "./contract-types";

export interface NormalizedValue {
  baseValue: number;
  baseUnit: string;
  quantityKind: string;
}

export interface ConversionError {
  inputId: string;
  reason: string;
}

export function normalizeInput(
  inputId: string,
  displayValue: number,
  displayUnit: string,
  baseUnit: string,
  quantityKind: string,
  registry: ConversionRegistry,
): NormalizedValue | ConversionError {
  const entry = registry[quantityKind];
  if (!entry) {
    return {
      inputId,
      reason: `No conversion registry entry for quantity kind: ${quantityKind}`,
    };
  }

  if (displayUnit === baseUnit) {
    return {
      baseValue: displayValue,
      baseUnit,
      quantityKind,
    };
  }

  const fromEntry = entry.units.find((u: ConversionEntry) => u.unit === displayUnit);
  if (!fromEntry) {
    return {
      inputId,
      reason: `Unknown display unit "${displayUnit}" for ${quantityKind}`,
    };
  }

  const toEntry = entry.units.find((u: ConversionEntry) => u.unit === baseUnit);
  if (!toEntry) {
    return {
      inputId,
      reason: `Unknown base unit "${baseUnit}" for ${quantityKind}`,
    };
  }

  // Convert: display -> base unit
  // Step 1: display -> registry base
  const baseValue =
    fromEntry.offset !== undefined
      ? (displayValue - fromEntry.offset) / fromEntry.factor
      : displayValue * fromEntry.factor;

  // Step 2: registry base -> target base unit (if target != registry base)
  const finalValue =
    toEntry.offset !== undefined
      ? baseValue * toEntry.factor + toEntry.offset
      : baseValue / toEntry.factor;

  return {
    baseValue: finalValue,
    baseUnit,
    quantityKind,
  };
}

export function normalizeInputs(
  rawInputs: Record<string, number>,
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

    if (typeof rawValue !== "number") {
      normalized[inp.id] = {
        baseValue: rawValue as unknown as number,
        baseUnit,
        quantityKind: inp.quantity_kind,
      };
      continue;
    }

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
  // Convert oldValue from oldUnit to newUnit (preserving physical quantity)
  const entry = registry[quantityKind];
  if (!entry) {
    return {
      inputId: quantityKind,
      reason: `No conversion registry for quantity kind: ${quantityKind}`,
    };
  }

  const oldEntry = entry.units.find((u: ConversionEntry) => u.unit === oldUnit);
  const newEntry = entry.units.find((u: ConversionEntry) => u.unit === newUnit);

  if (!oldEntry) {
    return { inputId: oldUnit, reason: `Unknown unit: ${oldUnit}` };
  }
  if (!newEntry) {
    return { inputId: newUnit, reason: `Unknown unit: ${newUnit}` };
  }

  // Convert to registry base first, then to new unit
  const baseValue =
    oldEntry.offset !== undefined
      ? (oldValue - oldEntry.offset) / oldEntry.factor
      : oldValue * oldEntry.factor;

  const newValue =
    newEntry.offset !== undefined
      ? baseValue * newEntry.factor + newEntry.offset
      : baseValue / newEntry.factor;

  return { newValue };
}
