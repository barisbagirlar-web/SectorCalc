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
 * Versioned compatibility map for legacy schemas whose UI label and declared
 * display unit diverged. These are calculation-contract migrations, not
 * heuristic conversions. Remove an entry only after the source schema is
 * regenerated with the same explicit display unit.
 */
const LEGACY_DISPLAY_UNIT_OVERRIDES: Readonly<Record<string, string>> = {
  weld_density: "g_per_cm3",
};

/**
 * Normalize a unit registry entry that may be in either array form (format A)
 * or flat-object form (format B) into a safe ConversionEntry array.
 */
export function normalizeUnitRegistryEntry(
  entry: Record<string, unknown>,
): ConversionEntry[] {
  if (Array.isArray(entry.units)) {
    return entry.units as ConversionEntry[];
  }

  const units: ConversionEntry[] = [];
  for (const [unitName, unitValue] of Object.entries(entry)) {
    if (unitName === "base_unit" || unitName === "unit_family") continue;
    if (!unitValue || typeof unitValue !== "object") continue;
    const uv = unitValue as Record<string, unknown>;
    if (typeof uv.factor !== "number" || !Number.isFinite(uv.factor) || uv.factor === 0) continue;
    units.push({
      unit: unitName,
      factor: uv.factor,
      offset: typeof uv.offset === "number" ? uv.offset : undefined,
      label: typeof uv.label === "string" ? uv.label : undefined,
    });
  }

  return units;
}

function normalizeDirectContractConversion(
  displayValue: number,
  displayUnit: string,
  baseUnit: string,
  quantityKind: string,
): number | null {
  if (
    quantityKind === "density" &&
    displayUnit === "g_per_cm3" &&
    baseUnit === "kg_per_m3"
  ) {
    return displayValue * 1000;
  }

  if (
    quantityKind === "density" &&
    displayUnit === "kg_per_m3" &&
    baseUnit === "g_per_cm3"
  ) {
    return displayValue / 1000;
  }

  return null;
}

export function normalizeInput(
  inputId: string,
  displayValue: number,
  displayUnit: string,
  baseUnit: string,
  quantityKind: string,
  registry: ConversionRegistry,
): NormalizedValue | ConversionError {
  if (!Number.isFinite(displayValue)) {
    return { inputId, reason: `Non-finite display value for ${inputId}` };
  }

  if (!displayUnit || !baseUnit) {
    return { inputId, reason: `Missing display/base unit for ${inputId}` };
  }

  if (displayUnit === baseUnit) {
    return {
      baseValue: displayValue,
      baseUnit,
      quantityKind,
    };
  }

  const direct = normalizeDirectContractConversion(
    displayValue,
    displayUnit,
    baseUnit,
    quantityKind,
  );
  if (direct !== null) {
    if (!Number.isFinite(direct)) {
      return { inputId, reason: `Unit conversion produced a non-finite value for ${inputId}` };
    }
    return { baseValue: direct, baseUnit, quantityKind };
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

  const registryBaseValue =
    fromEntry.offset !== undefined
      ? (displayValue - fromEntry.offset) / fromEntry.factor
      : displayValue * fromEntry.factor;

  const finalValue =
    toEntry.offset !== undefined
      ? registryBaseValue * toEntry.factor + toEntry.offset
      : registryBaseValue / toEntry.factor;

  if (!Number.isFinite(finalValue)) {
    return { inputId, reason: `Unit conversion produced a non-finite value for ${inputId}` };
  }

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
      name?: string;
      normalized_id?: string;
      quantity_kind: string;
      base_unit: string | null;
      unit_selectable?: boolean;
    }>;
  },
  registry: ConversionRegistry,
): { normalized: Record<string, NormalizedValue>; errors: ConversionError[] } {
  const normalized: Record<string, NormalizedValue> = {};
  const errors: ConversionError[] = [];

  for (const inp of schema.inputs) {
    const rawValue = rawInputs[inp.id];
    if (rawValue === undefined || rawValue === null) continue;

    if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
      errors.push({ inputId: inp.id, reason: `Input ${inp.id} must be a finite number` });
      continue;
    }

    const legacyDisplayUnit = LEGACY_DISPLAY_UNIT_OVERRIDES[inp.id];
    const configuredDisplayUnit = selectedUnits[inp.id] || inp.base_unit || "";
    const displayUnit =
      legacyDisplayUnit && inp.unit_selectable !== true
        ? legacyDisplayUnit
        : configuredDisplayUnit;
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
    return { inputId: quantityKind, reason: "Cannot convert a non-finite value" };
  }

  if (oldUnit === newUnit) return { newValue: oldValue };

  const direct = normalizeDirectContractConversion(
    oldValue,
    oldUnit,
    newUnit,
    quantityKind,
  );
  if (direct !== null) return { newValue: direct };

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

  const baseValue =
    oldEntry.offset !== undefined
      ? (oldValue - oldEntry.offset) / oldEntry.factor
      : oldValue * oldEntry.factor;

  const newValue =
    newEntry.offset !== undefined
      ? baseValue * newEntry.factor + newEntry.offset
      : baseValue / newEntry.factor;

  if (!Number.isFinite(newValue)) {
    return { inputId: quantityKind, reason: "Unit conversion produced a non-finite value" };
  }

  return { newValue };
}
