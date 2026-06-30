/**
 * Deterministic unit conversion rules — ADIM 5 regional unit motor.
 */

import type { CanonicalUnitId } from "@/lib/core/units/unit-definitions";
import { lookupCanonicalUnit } from "@/lib/core/units/unit-definitions";

export type ConversionResult =
  | { readonly ok: true; readonly value: number }
  | { readonly ok: false; readonly reason: "unknown_unit" | "incompatible_units" | "non_finite" };

type LinearConversion = {
  readonly from: CanonicalUnitId;
  readonly to: CanonicalUnitId;
  readonly factor: number;
  readonly offset?: number;
};

const LINEAR_CONVERSIONS: readonly LinearConversion[] = [
  { from: "m", to: "ft", factor: 3.280839895 },
  { from: "m", to: "in", factor: 39.37007874 },
  { from: "cm", to: "in", factor: 0.3937007874 },
  { from: "km", to: "mi", factor: 0.6213711922 },
  { from: "m2", to: "sqft", factor: 10.7639104167 },
  { from: "acre", to: "sqft", factor: 43560 },
  { from: "L", to: "gal", factor: 0.2641720524 },
  { from: "m3", to: "cuft", factor: 35.3146667215 },
  { from: "kg", to: "lb", factor: 2.2046226218 },
  { from: "g", to: "oz", factor: 0.0352739619 },
  { from: "mps", to: "mph", factor: 2.2369362921 },
  { from: "kph", to: "mph", factor: 0.6213711922 },
] as const;

const AFFINE_CONVERSIONS: readonly LinearConversion[] = [
  { from: "C", to: "F", factor: 9 / 5, offset: 32 },
] as const;

function buildConversionMap(
  conversions: readonly LinearConversion[],
): Map<string, { factor: number; offset: number }> {
  const map = new Map<string, { factor: number; offset: number }>();

  for (const conversion of conversions) {
    map.set(`${conversion.from}->${conversion.to}`, {
      factor: conversion.factor,
      offset: conversion.offset ?? 0,
    });
    map.set(`${conversion.to}->${conversion.from}`, {
      factor: 1 / conversion.factor,
      offset: conversion.offset !== undefined ? -conversion.offset / conversion.factor : 0,
    });
  }

  return map;
}

const LINEAR_MAP = buildConversionMap(LINEAR_CONVERSIONS);
const AFFINE_MAP = buildConversionMap(AFFINE_CONVERSIONS);

function roundDeterministic(value: number): number {
  return Number(value.toFixed(12));
}

function convertById(
  value: number,
  fromUnit: CanonicalUnitId,
  toUnit: CanonicalUnitId,
): ConversionResult {
  if (!Number.isFinite(value)) {
    return { ok: false, reason: "non_finite" };
  }

  if (fromUnit === toUnit) {
    return { ok: true, value };
  }

  const affineRule = AFFINE_MAP.get(`${fromUnit}->${toUnit}`);
  if (affineRule) {
    return { ok: true, value: roundDeterministic(value * affineRule.factor + affineRule.offset) };
  }

  const linearRule = LINEAR_MAP.get(`${fromUnit}->${toUnit}`);
  if (linearRule) {
    return { ok: true, value: roundDeterministic(value * linearRule.factor + linearRule.offset) };
  }

  return { ok: false, reason: "incompatible_units" };
}

export function convertCanonicalUnits(
  value: number,
  fromUnit: CanonicalUnitId,
  toUnit: CanonicalUnitId,
): ConversionResult {
  return convertById(value, fromUnit, toUnit);
}

export function convertUnits(
  value: number,
  fromUnitRaw: string,
  toUnitRaw: string,
): ConversionResult {
  const fromUnit = lookupCanonicalUnit(fromUnitRaw);
  const toUnit = lookupCanonicalUnit(toUnitRaw);

  if (!fromUnit || !toUnit) {
    return { ok: false, reason: "unknown_unit" };
  }

  if (fromUnit.dimension !== toUnit.dimension) {
    return { ok: false, reason: "incompatible_units" };
  }

  return convertById(value, fromUnit.id, toUnit.id);
}

export function isConvertiblePair(fromUnitRaw: string, toUnitRaw: string): boolean {
  const fromUnit = lookupCanonicalUnit(fromUnitRaw);
  const toUnit = lookupCanonicalUnit(toUnitRaw);
  if (!fromUnit || !toUnit) {
    return false;
  }
  if (fromUnit.id === toUnit.id) {
    return true;
  }
  return convertById(1, fromUnit.id, toUnit.id).ok;
}
