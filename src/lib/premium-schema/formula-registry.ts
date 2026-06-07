/**
 * Safe Formula Registry — typed, testable functions only.
 * Organized under 10 locked industrial formula families.
 * Schemas reference formulaId; never expression strings.
 */

import {
  FORMULA_FAMILIES,
  FORMULA_FAMILY_LABELS,
  type FormulaFamilyId,
} from "@/lib/premium-schema/formula-families";

export type FormulaInputs = Readonly<Record<string, number>>;

export type FormulaFn = (inputs: FormulaInputs) => number;

export interface FormulaDefinition {
  readonly id: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly fn: FormulaFn;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return assertFinite(typeof value === "number" ? value : Number(value), fallback);
}

// ---------------------------------------------------------------------------
// Definitions (family → tested function)
// ---------------------------------------------------------------------------

const FORMULA_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "measurement.variance_percent",
    family: "measurement",
    label: "Measurement variance percent",
    fn: (inputs) => {
      const actual = num(inputs, "actual");
      const target = num(inputs, "target");
      if (target === 0) return 0;
      return assertFinite(((actual - target) / target) * 100);
    },
  },
  {
    id: "benchmark.variance_percent",
    family: "benchmark",
    label: "Benchmark variance percent",
    fn: (inputs) => {
      const actual = num(inputs, "actual");
      const target = num(inputs, "target");
      if (target === 0) return 0;
      return assertFinite(((actual - target) / target) * 100);
    },
  },
  {
    id: "time.labor_cost",
    family: "time",
    label: "Time / labor cost",
    fn: (inputs) => assertFinite(num(inputs, "hourlyCost") * num(inputs, "lossHours")),
  },
  {
    id: "scrap.material_cost",
    family: "scrap",
    label: "Scrap material cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "materialCost") * (num(inputs, "scrapRate") / 100)),
  },
  {
    id: "scrap.combined_operating",
    family: "scrap",
    label: "Combined operating cost stack",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "laborCost") + num(inputs, "materialCost") + num(inputs, "overheadCost")
      ),
  },
  {
    id: "scrap.total_exposure",
    family: "scrap",
    label: "Total loss exposure with hidden multiplier",
    fn: (inputs) =>
      assertFinite(num(inputs, "baseCost") * num(inputs, "hiddenMultiplier", 1)),
  },
  {
    id: "oee.basic",
    family: "oee",
    label: "OEE score",
    fn: (inputs) =>
      assertFinite(
        (num(inputs, "availability") * num(inputs, "performance") * num(inputs, "quality")) /
          10000
      ),
  },
  {
    id: "oee.availability_loss_cost",
    family: "oee",
    label: "Availability loss cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "machineRate") *
          Math.max(0, num(inputs, "downtimeHours") - num(inputs, "plannedHours") * 0.02)
      ),
  },
  {
    id: "route.deadhead_cost",
    family: "route",
    label: "Deadhead route cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "distanceKm") *
          num(inputs, "costPerKm") *
          (num(inputs, "emptyReturnPercent") / 100)
      ),
  },
  {
    id: "route.total_freight_cost",
    family: "route",
    label: "Total freight cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "fuelCost") +
          num(inputs, "driverCost") +
          num(inputs, "tolls") +
          num(inputs, "deadheadCost")
      ),
  },
  {
    id: "energy.excess_kwh_cost",
    family: "energy",
    label: "Excess kWh cost",
    fn: (inputs) =>
      assertFinite(Math.max(0, num(inputs, "currentKwh") - num(inputs, "targetKwh")) * num(inputs, "rate")),
  },
  {
    id: "energy.kwh_cost",
    family: "energy",
    label: "kWh cost",
    fn: (inputs) => assertFinite(num(inputs, "kwh") * num(inputs, "rate")),
  },
  {
    id: "energy.peak_demand_cost",
    family: "energy",
    label: "Peak demand cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "peakKwh") * num(inputs, "peakRate") + num(inputs, "demandCharge")),
  },
  {
    id: "energy.total_energy_cost",
    family: "energy",
    label: "Total energy cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "excessKwh") * num(inputs, "energyRate") + num(inputs, "peakCost")),
  },
  {
    id: "carbon.cbam_exposure",
    family: "carbon",
    label: "CBAM exposure",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "emissionsTon") *
          num(inputs, "carbonPrice") *
          (num(inputs, "exposurePercent") / 100)
      ),
  },
  {
    id: "cost.p90_buffer",
    family: "cost",
    label: "P90 volatility buffer",
    fn: (inputs) =>
      assertFinite(num(inputs, "adjustedCost") * (num(inputs, "volatilityPercent") / 100) * 1.2816),
  },
  {
    id: "cost.minimum_safe_price",
    family: "cost",
    label: "Minimum safe price",
    fn: (inputs) => {
      const denom = Math.max(5, 100 - num(inputs, "targetMarginPercent"));
      return assertFinite(num(inputs, "p90Cost") / (denom / 100));
    },
  },
  {
    id: "yield.gap_value",
    family: "scrap",
    label: "Yield gap value",
    fn: (inputs) => assertFinite(num(inputs, "yieldGapTon") * num(inputs, "pricePerTon")),
  },
];

// Legacy aliases — stable ids for existing pilot schemas (same functions)
const LEGACY_ALIASES: Readonly<Record<string, string>> = {
  "loss.time_cost": "time.labor_cost",
  "loss.scrap_cost": "scrap.material_cost",
  "loss.combined_operating": "scrap.combined_operating",
  "loss.total_exposure": "scrap.total_exposure",
};

export const FORMULA_META: Record<
  string,
  { readonly family: FormulaFamilyId; readonly label: string }
> = {};

export const FORMULA_REGISTRY: Record<string, FormulaFn> = {};

for (const def of FORMULA_DEFINITIONS) {
  FORMULA_META[def.id] = { family: def.family, label: def.label };
  FORMULA_REGISTRY[def.id] = def.fn;
}

for (const [legacyId, canonicalId] of Object.entries(LEGACY_ALIASES)) {
  const canonical = FORMULA_DEFINITIONS.find((d) => d.id === canonicalId);
  if (!canonical) continue;
  FORMULA_META[legacyId] = { family: canonical.family, label: `${canonical.label} (legacy id)` };
  FORMULA_REGISTRY[legacyId] = canonical.fn;
}

/** Formulas grouped by the 10 locked families. */
export const FORMULAS_BY_FAMILY = FORMULA_FAMILIES.reduce<
  Record<FormulaFamilyId, readonly string[]>
>(
  (acc, family) => {
    acc[family] = Object.entries(FORMULA_META)
      .filter(([, meta]) => meta.family === family)
      .map(([id]) => id)
      .sort();
    return acc;
  },
  {} as Record<FormulaFamilyId, readonly string[]>
);

export { FORMULA_FAMILIES, FORMULA_FAMILY_LABELS };

export function getFormulaFn(formulaId: string): FormulaFn {
  const fn = FORMULA_REGISTRY[formulaId];
  if (!fn) {
    throw new Error(`Unknown formulaId: ${formulaId}`);
  }
  return fn;
}

export function getFormulaFamily(formulaId: string): FormulaFamilyId | null {
  return FORMULA_META[formulaId]?.family ?? null;
}

export function listRegisteredFormulaIds(): readonly string[] {
  return Object.keys(FORMULA_REGISTRY).sort();
}

export function formulaIdsInFamily(family: FormulaFamilyId): readonly string[] {
  return FORMULAS_BY_FAMILY[family] ?? [];
}
