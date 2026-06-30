import { convertUnits } from "@/lib/core/units/unit-conversions";
import { getPreferredCanonicalUnit, lookupCanonicalUnit, type UnitDimension } from "@/lib/core/units/unit-definitions";
import type { NormalizeInputValueInput, NormalizeInputValueResult, QuantityType } from "@/lib/features/regional/types";
import { getCanonicalUnitForQuantity, getQuantityDefinition, isUnitAllowedForQuantity } from "@/lib/features/regional/unit-systems";

export const REGIONAL_ROUNDING_POLICY = { canonicalFractionDigits: 10, displayFractionDigits: 6 } as const;

function roundToPolicy(value: number, fractionDigits: number): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** fractionDigits;
  return Math.round(value * factor) / factor;
}

function resolveUnitDimension(quantityType: QuantityType): UnitDimension | null {
  return getQuantityDefinition(quantityType).unitDimension ?? null;
}

export function isSupportedUnit(unit: string, dimension: UnitDimension): boolean {
  const definition = lookupCanonicalUnit(unit);
  return definition !== null && definition.dimension === dimension;
}

function convertToCanonical(value: number, unit: string, dimension: UnitDimension): number {
  const canonicalId = getPreferredCanonicalUnit(dimension, "metric");
  if (!canonicalId) return value;
  const result = convertUnits(value, unit, canonicalId);
  if (!result.ok) throw new Error(`canonical_conversion_failed:${result.reason}`);
  return result.value;
}

function convertFromCanonical(value: number, unit: string, dimension: UnitDimension): number {
  const canonicalId = getPreferredCanonicalUnit(dimension, "metric");
  if (!canonicalId) return value;
  const result = convertUnits(value, canonicalId, unit);
  if (!result.ok) throw new Error(`display_conversion_failed:${result.reason}`);
  return result.value;
}

export function normalizeInputValue(input: NormalizeInputValueInput): NormalizeInputValueResult {
  const { value, unit, quantityType } = input;
  if (!Number.isFinite(value)) return { ok: false, reason: "non_finite" };
  const canonicalUnit = getCanonicalUnitForQuantity(quantityType);
  if (quantityType === "currency" || quantityType === "percentage" || quantityType === "count") {
    return { ok: true, canonicalValue: value, canonicalUnit, quantityType };
  }
  const dimension = resolveUnitDimension(quantityType);
  if (!dimension) return { ok: false, reason: "unsupported_quantity" };
  const normalizedUnit = unit.trim();
  if (!isSupportedUnit(normalizedUnit, dimension)) return { ok: false, reason: "unknown_unit" };
  try {
    const canonicalValue = roundToPolicy(convertToCanonical(value, normalizedUnit, dimension), REGIONAL_ROUNDING_POLICY.canonicalFractionDigits);
    return { ok: true, canonicalValue, canonicalUnit, quantityType };
  } catch {
    return { ok: false, reason: "incompatible_units" };
  }
}

export function denormalizeOutputValue(options: { readonly canonicalValue: number; readonly quantityType: QuantityType; readonly targetUnit: string }): NormalizeInputValueResult {
  const { canonicalValue, quantityType, targetUnit } = options;
  if (!Number.isFinite(canonicalValue)) return { ok: false, reason: "non_finite" };
  if (quantityType === "currency" || quantityType === "percentage" || quantityType === "count") {
    return { ok: true, canonicalValue, canonicalUnit: getCanonicalUnitForQuantity(quantityType), quantityType };
  }
  const dimension = resolveUnitDimension(quantityType);
  if (!dimension) return { ok: false, reason: "unsupported_quantity" };
  const normalizedUnit = targetUnit.trim();
  if (!isSupportedUnit(normalizedUnit, dimension)) return { ok: false, reason: "unknown_unit" };
  try {
    const displayValue = roundToPolicy(convertFromCanonical(canonicalValue, normalizedUnit, dimension), REGIONAL_ROUNDING_POLICY.displayFractionDigits);
    return { ok: true, canonicalValue: displayValue, canonicalUnit: normalizedUnit, quantityType };
  } catch {
    return { ok: false, reason: "incompatible_units" };
  }
}

export function validateUnitForQuantity(unit: string, quantityType: QuantityType, regionCode: Parameters<typeof isUnitAllowedForQuantity>[2]): { readonly ok: true } | { readonly ok: false; readonly reason: "unknown_unit" } {
  if (!isUnitAllowedForQuantity(quantityType, unit, regionCode)) return { ok: false, reason: "unknown_unit" };
  return { ok: true };
}
