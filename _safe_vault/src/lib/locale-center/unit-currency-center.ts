/* eslint-disable */
// @ts-nocheck

import type { SupportedLocale } from "@/lib/locale-center/locale-config";
import { REGION_DEFAULTS } from "@/lib/locale-center/region-defaults";
import type { SupportedRegion } from "@/lib/locale-center/locale-types";

export type UnitGroup =
  | "length"
  | "area"
  | "volume"
  | "weight"
  | "mass"
  | "time"
  | "speed"
  | "temperature"
  | "pressure"
  | "power"
  | "energy"
  | "currency"
  | "percentage"
  | "count"
  | "torque"
  | "force"
  | "flow"
  | "density";

export type UnitOption = {
  readonly value: string;
  readonly label: string;
};

const UNIT_SYMBOL_DEFAULTS: Record<UnitGroup, Record<"metric" | "imperial" | "mixed", string>> = {
  length: { metric: "m", imperial: "ft", mixed: "m" },
  area: { metric: "m²", imperial: "ft²", mixed: "m²" },
  volume: { metric: "m³", imperial: "ft³", mixed: "m³" },
  weight: { metric: "kg", imperial: "lb", mixed: "kg" },
  mass: { metric: "kg", imperial: "lb", mixed: "kg" },
  time: { metric: "h", imperial: "h", mixed: "h" },
  speed: { metric: "km/h", imperial: "mph", mixed: "km/h" },
  temperature: { metric: "°C", imperial: "°F", mixed: "°C" },
  pressure: { metric: "bar", imperial: "psi", mixed: "bar" },
  power: { metric: "kW", imperial: "hp", mixed: "kW" },
  energy: { metric: "kWh", imperial: "kWh", mixed: "kWh" },
  currency: { metric: "USD", imperial: "USD", mixed: "USD" },
  percentage: { metric: "%", imperial: "%", mixed: "%" },
  count: { metric: "count", imperial: "count", mixed: "count" },
  torque: { metric: "N·m", imperial: "lb·ft", mixed: "N·m" },
  force: { metric: "N", imperial: "lbf", mixed: "N" },
  flow: { metric: "L/min", imperial: "gal/min", mixed: "L/min" },
  density: { metric: "kg/m³", imperial: "lb/ft³", mixed: "kg/m³" },
};

const UNIT_LABELS: Record<SupportedLocale, Record<string, string>> = {
  en: {
    m: "meter (m)",
    cm: "centimeter (cm)",
    kg: "kilogram (kg)",
    kWh: "kilowatt-hour (kWh)",
    bar: "bar",
    ft: "foot (ft)",
    in: "inch (in)",
    lb: "pound (lb)",
    psi: "psi",
    L: "liter (L)",
    litre: "liter (L)",
  },
} as Record<SupportedLocale, Record<string, string>>;

const GROUP_OPTIONS: Partial<Record<UnitGroup, readonly string[]>> = {
  length: ["m", "cm", "mm", "ft", "in"],
  area: ["m²", "ft²", "cm²"],
  volume: ["m³", "ft³", "L"],
  weight: ["kg", "g", "lb"],
  mass: ["kg", "g", "lb"],
  energy: ["kWh", "MJ"],
  pressure: ["bar", "psi", "Pa"],
  temperature: ["°C", "°F", "K"],
  currency: ["TRY", "USD", "EUR", "GBP", "AED", "SAR"],
};

function resolveRegionDefaults(locale: SupportedLocale, region: SupportedRegion) {
  if (region in REGION_DEFAULTS) {
    return REGION_DEFAULTS[region as keyof typeof REGION_DEFAULTS];
  }
  const fallback = "GLOBAL";
  return REGION_DEFAULTS[fallback];
}

export function getDefaultCurrency(locale: SupportedLocale, region: SupportedRegion): string {
  const defaults = resolveRegionDefaults(locale, region);
  return defaults.currency;
}

export function getDefaultUnit(
  locale: SupportedLocale,
  region: SupportedRegion,
  group: UnitGroup,
): string {
  const defaults = resolveRegionDefaults(locale, region);
  const system = defaults.measurementSystem;
  return UNIT_SYMBOL_DEFAULTS[group][system];
}

export function getUnitLabel(locale: SupportedLocale, unitSymbol: string): string {
  return UNIT_LABELS[locale][unitSymbol] ?? unitSymbol;
}

export function getUnitOptions(
  locale: SupportedLocale,
  region: SupportedRegion,
  group: UnitGroup,
): UnitOption[] {
  const symbols = GROUP_OPTIONS[group] ?? [getDefaultUnit(locale, region, group)];
  return symbols.map((value) => ({
    value,
    label: getUnitLabel(locale, value),
  }));
}
