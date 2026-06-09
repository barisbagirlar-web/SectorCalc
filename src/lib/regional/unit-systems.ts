import type { UnitDimension } from "@/lib/units/unit-definitions";
import type { QuantityType, RegionalEngineCode, UnitSystemId } from "@/lib/regional/types";
import { getDefaultUnitSystemForRegion } from "@/lib/regional/regions";

type QuantityUnitDefinition = { readonly quantityType: QuantityType; readonly canonicalUnit: string; readonly displayUnits: readonly string[]; readonly unitDimension?: UnitDimension };

const QUANTITY_REGISTRY: Record<QuantityType, QuantityUnitDefinition> = {
  length: { quantityType: "length", canonicalUnit: "m", displayUnits: ["cm", "m", "km", "in", "ft", "mi"], unitDimension: "length" },
  area: { quantityType: "area", canonicalUnit: "m2", displayUnits: ["m2", "ft2", "sqft", "acre"], unitDimension: "area" },
  volume: { quantityType: "volume", canonicalUnit: "m3", displayUnits: ["L", "m3", "gal", "ft3", "cuft"], unitDimension: "volume" },
  mass: { quantityType: "mass", canonicalUnit: "kg", displayUnits: ["g", "kg", "lb", "oz"], unitDimension: "mass" },
  time: { quantityType: "time", canonicalUnit: "h", displayUnits: ["min", "h", "hr"], unitDimension: "time" },
  currency: { quantityType: "currency", canonicalUnit: "USD", displayUnits: ["USD", "EUR", "TRY", "GBP", "SAR", "AED"] },
  energy: { quantityType: "energy", canonicalUnit: "kWh", displayUnits: ["kWh", "MWh", "J", "MJ"] },
  power: { quantityType: "power", canonicalUnit: "kW", displayUnits: ["W", "kW", "MW", "hp"] },
  temperature: { quantityType: "temperature", canonicalUnit: "C", displayUnits: ["C", "F"], unitDimension: "temperature" },
  flowRate: { quantityType: "flowRate", canonicalUnit: "m3/h", displayUnits: ["L/min", "gal/min"], unitDimension: "rate" },
  speed: { quantityType: "speed", canonicalUnit: "m/s", displayUnits: ["m/s", "km/h", "kph", "mph"], unitDimension: "rate" },
  percentage: { quantityType: "percentage", canonicalUnit: "%", displayUnits: ["%"], unitDimension: "percent" },
  count: { quantityType: "count", canonicalUnit: "count", displayUnits: ["count"], unitDimension: "count" },
};

const IMPERIAL_PREFERRED: Partial<Record<QuantityType, readonly string[]>> = {
  length: ["in", "ft", "mi", "cm", "m", "km"], area: ["ft2", "sqft", "acre", "m2"], volume: ["gal", "ft3", "cuft", "L", "m3"],
  mass: ["lb", "oz", "g", "kg"], speed: ["mph", "kph", "m/s"], flowRate: ["gal/min", "L/min"], temperature: ["F", "C"],
};

const REGION_CURRENCY_OPTIONS: Record<RegionalEngineCode, readonly string[]> = {
  GLOBAL: ["USD", "EUR", "GBP"], TR: ["TRY", "USD", "EUR"], US: ["USD", "EUR", "GBP"], DE: ["EUR", "USD", "GBP"],
  FR: ["EUR", "USD", "GBP"], ES: ["EUR", "USD", "GBP"], AR: ["USD", "SAR", "AED", "EUR"],
};

export function getQuantityDefinition(quantityType: QuantityType): QuantityUnitDefinition { return QUANTITY_REGISTRY[quantityType]; }
export function getCanonicalUnitForQuantity(quantityType: QuantityType): string { return QUANTITY_REGISTRY[quantityType].canonicalUnit; }

export function isUnitAllowedForQuantity(quantityType: QuantityType, unit: string, regionCode: RegionalEngineCode): boolean {
  const normalized = unit.trim().toLowerCase();
  return getAvailableUnitsForQuantity(quantityType, regionCode).some((c) => c.toLowerCase() === normalized);
}

export function getAvailableUnitsForQuantity(quantityType: QuantityType, regionCode: RegionalEngineCode): readonly string[] {
  if (quantityType === "currency") return REGION_CURRENCY_OPTIONS[regionCode];
  const unitSystem = getDefaultUnitSystemForRegion(regionCode);
  if (unitSystem === "imperial" && IMPERIAL_PREFERRED[quantityType]) return IMPERIAL_PREFERRED[quantityType];
  return QUANTITY_REGISTRY[quantityType].displayUnits;
}

export function getDefaultDisplayUnitForQuantity(quantityType: QuantityType, regionCode: RegionalEngineCode): string {
  return getAvailableUnitsForQuantity(quantityType, regionCode)[0] ?? getCanonicalUnitForQuantity(quantityType);
}

export function mapDimensionToQuantityType(dimension: string): QuantityType | null {
  const map: Record<string, QuantityType> = { length: "length", area: "area", volume: "volume", mass: "mass", time: "time", currency: "currency", energy: "energy", power: "power", temperature: "temperature", rate: "speed", percent: "percentage", count: "count", value: "count" };
  return map[dimension.toLowerCase()] ?? null;
}

export function mapFieldKeyToQuantityType(fieldKey: string, dimension: string): QuantityType | null {
  const fromDimension = mapDimensionToQuantityType(dimension);
  if (fromDimension) return fromDimension;
  const n = fieldKey.toLowerCase();
  if (n.includes("cost") || n.includes("price") || n.includes("budget") || n.includes("rent") || n.includes("fee") || n.includes("loan") || n.includes("payment")) return "currency";
  if (n.includes("percent") || n.includes("margin") || n.includes("rate")) return "percentage";
  if (n.includes("hour") || n.includes("time")) return "time";
  if (n.includes("weight") || n.includes("mass")) return "mass";
  if (n.includes("length") || n.includes("width") || n.includes("height")) return "length";
  return null;
}

export function resolveUnitSystemForRegion(regionCode: RegionalEngineCode): UnitSystemId {
  return getDefaultUnitSystemForRegion(regionCode);
}
