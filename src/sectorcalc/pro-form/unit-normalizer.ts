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
  displayValue: number,
  displayUnit: string,
  baseUnit: string,
  quantityKind: string,
  registry: ConversionRegistry,
): NormalizedValue | ConversionError {
  // Fast path: when display unit matches the base unit, no conversion needed.
  // This also handles missing registry entries for quantity kinds whose base
  // and display values are identical (e.g. dimensionless inputs with count units).
  if (displayUnit === baseUnit) {
    return {
      baseValue: displayValue,
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

  // Convert: display -> base unit
  // Registry convention: base_value = source_value * factor + offset
  // Step 1: source unit -> registry neutral base
  const baseValue = displayValue * fromEntry.factor + (fromEntry.offset ?? 0);

  // Step 2: registry neutral base -> target base unit
  const finalValue = (baseValue - (toEntry.offset ?? 0)) / toEntry.factor;

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

  const safeUnits = normalizeUnitRegistryEntry(entry as unknown as Record<string, unknown>);
  const oldEntry = safeUnits.find((u: ConversionEntry) => u.unit === oldUnit);
  const newEntry = safeUnits.find((u: ConversionEntry) => u.unit === newUnit);

  if (!oldEntry) {
    return { inputId: oldUnit, reason: `Unknown unit: ${oldUnit}` };
  }
  if (!newEntry) {
    return { inputId: newUnit, reason: `Unknown unit: ${newUnit}` };
  }

  // Convert to registry base first, then to new unit
  // Registry convention: base_value = source_value * factor + offset
  const baseValue = oldValue * oldEntry.factor + (oldEntry.offset ?? 0);
  const newValue = (baseValue - (newEntry.offset ?? 0)) / newEntry.factor;

  return { newValue };
}
