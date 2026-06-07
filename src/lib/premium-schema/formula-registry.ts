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
import type { PremiumOutputFormat } from "@/lib/premium-schema/premium-calculator-schema";

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

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }
  return assertFinite(numerator / denominator);
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
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
  {
    id: "loss.waste_exposure",
    family: "scrap",
    label: "Ingredient waste exposure",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyIngredientCost") * (num(inputs, "wasteRate") / 100)
      ),
  },
  {
    id: "loss.excess_waste_cost",
    family: "scrap",
    label: "Excess waste cost above target",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyIngredientCost") *
          (Math.max(0, num(inputs, "wasteRate") - num(inputs, "targetWasteRate")) / 100)
      ),
  },
  {
    id: "cost.margin_pressure",
    family: "cost",
    label: "Margin pressure from excess cost",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "excessCost"), num(inputs, "monthlyRevenue")) * 100),
  },
  {
    id: "time.delay_cost",
    family: "time",
    label: "Project delay cost",
    fn: (inputs) => nonNegative(num(inputs, "dailySiteCost") * num(inputs, "delayDays")),
  },
  {
    id: "cost.overrun_cost",
    family: "cost",
    label: "Budget overrun cost",
    fn: (inputs) =>
      nonNegative(num(inputs, "budget") * (num(inputs, "overrunPercent") / 100)),
  },
  {
    id: "cost.total_exposure",
    family: "cost",
    label: "Combined exposure stack",
    fn: (inputs) =>
      nonNegative(num(inputs, "a") + num(inputs, "b") + num(inputs, "c")),
  },
  {
    id: "time.rework_cost",
    family: "time",
    label: "Rework labor cost",
    fn: (inputs) => nonNegative(num(inputs, "reworkHours") * num(inputs, "laborRate")),
  },
  {
    id: "cost.food_cost_percent",
    family: "cost",
    label: "Food cost percent of revenue",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "ingredientCost"), num(inputs, "monthlyRevenue")) * 100),
  },
  {
    id: "cost.delivery_fee_cost",
    family: "cost",
    label: "Delivery platform fee cost",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyRevenue") * (num(inputs, "deliveryAppFeePercent") / 100)
      ),
  },
  {
    id: "cost.restaurant_margin_pressure",
    family: "cost",
    label: "Restaurant margin pressure percent",
    fn: (inputs) =>
      nonNegative(
        safeDivide(
          num(inputs, "ingredientCost") +
            num(inputs, "deliveryFeeCost") +
            num(inputs, "wasteExposure"),
          num(inputs, "monthlyRevenue")
        ) * 100
      ),
  },
  {
    id: "cost.variance",
    family: "cost",
    label: "Positive cost variance",
    fn: (inputs) => nonNegative(num(inputs, "actual") - num(inputs, "planned")),
  },
  {
    id: "route.distance_drift_cost",
    family: "route",
    label: "Distance drift fuel cost",
    fn: (inputs) =>
      nonNegative(
        Math.max(0, num(inputs, "actualDistanceKm") - num(inputs, "plannedDistanceKm")) *
          num(inputs, "fuelCostPerKm")
      ),
  },
  {
    id: "cost.sum2",
    family: "cost",
    label: "Two-component cost sum",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b")),
  },
  {
    id: "cost.total2",
    family: "cost",
    label: "Two-component exposure total",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b")),
  },
  {
    id: "cost.value",
    family: "cost",
    label: "Pass-through numeric value",
    fn: (inputs) => nonNegative(num(inputs, "value")),
  },
  {
    id: "energy.compressor_leak_kwh",
    family: "energy",
    label: "Compressor leak kWh",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "compressorKw") *
          num(inputs, "operatingHours") *
          (num(inputs, "leakPercent") / 100)
      ),
  },
  {
    id: "cost.annualize",
    family: "cost",
    label: "Annualize monthly cost",
    fn: (inputs) => nonNegative(num(inputs, "monthlyCost") * 12),
  },
  {
    id: "cloud.api_call_cost",
    family: "cost",
    label: "API call volume cost",
    fn: (inputs) =>
      nonNegative(
        (num(inputs, "monthlyApiCalls") / 1000) * num(inputs, "costPerThousandCalls")
      ),
  },
  {
    id: "agriculture.yield_loss_revenue",
    family: "benchmark",
    label: "Yield loss revenue exposure",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "areaHa") *
          Math.max(0, num(inputs, "expectedYieldTonPerHa") - num(inputs, "actualYieldTonPerHa")) *
          num(inputs, "pricePerTon")
      ),
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

export type FormulaOutputHint = PremiumOutputFormat;

export interface FormulaRegistryMeta {
  readonly formulaId: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly description: string;
  readonly requiredInputs: readonly string[];
  readonly outputHint: FormulaOutputHint;
}

const FORMULA_META_DETAILS: Record<
  string,
  Omit<FormulaRegistryMeta, "formulaId" | "family" | "label">
> = {
  "measurement.variance_percent": {
    description: "Percent deviation of actual versus target measurement.",
    requiredInputs: ["actual", "target"],
    outputHint: "percentage",
  },
  "benchmark.variance_percent": {
    description: "Percent variance against a benchmark target.",
    requiredInputs: ["actual", "target"],
    outputHint: "percentage",
  },
  "time.labor_cost": {
    description: "Labor or machine time converted to cost exposure.",
    requiredInputs: ["hourlyCost", "lossHours"],
    outputHint: "currency",
  },
  "scrap.material_cost": {
    description: "Material cost multiplied by scrap rate percent.",
    requiredInputs: ["materialCost", "scrapRate"],
    outputHint: "currency",
  },
  "scrap.combined_operating": {
    description: "Stack of labor, material and overhead operating costs.",
    requiredInputs: ["laborCost", "materialCost", "overheadCost"],
    outputHint: "currency",
  },
  "scrap.total_exposure": {
    description: "Base cost scaled by hidden loss multiplier.",
    requiredInputs: ["baseCost", "hiddenMultiplier"],
    outputHint: "currency",
  },
  "oee.basic": {
    description: "Classic OEE score from availability, performance and quality.",
    requiredInputs: ["availability", "performance", "quality"],
    outputHint: "score",
  },
  "oee.availability_loss_cost": {
    description: "Cost of availability loss above planned tolerance.",
    requiredInputs: ["machineRate", "downtimeHours", "plannedHours"],
    outputHint: "currency",
  },
  "route.deadhead_cost": {
    description: "Unpaid return distance cost exposure.",
    requiredInputs: ["distanceKm", "costPerKm", "emptyReturnPercent"],
    outputHint: "currency",
  },
  "route.total_freight_cost": {
    description: "Fuel, driver, tolls and deadhead combined freight cost.",
    requiredInputs: ["fuelCost", "driverCost", "tolls", "deadheadCost"],
    outputHint: "currency",
  },
  "energy.excess_kwh_cost": {
    description: "Cost of kWh consumption above target.",
    requiredInputs: ["currentKwh", "targetKwh", "rate"],
    outputHint: "currency",
  },
  "energy.kwh_cost": {
    description: "Simple kWh times rate cost.",
    requiredInputs: ["kwh", "rate"],
    outputHint: "currency",
  },
  "energy.peak_demand_cost": {
    description: "Peak kWh tariff plus demand charge.",
    requiredInputs: ["peakKwh", "peakRate", "demandCharge"],
    outputHint: "currency",
  },
  "energy.total_energy_cost": {
    description: "Excess kWh cost plus peak demand stack.",
    requiredInputs: ["excessKwh", "energyRate", "peakCost"],
    outputHint: "currency",
  },
  "carbon.cbam_exposure": {
    description: "Carbon border adjustment exposure estimate.",
    requiredInputs: ["emissionsTon", "carbonPrice", "exposurePercent"],
    outputHint: "currency",
  },
  "cost.p90_buffer": {
    description: "P90 volatility buffer on adjusted cost.",
    requiredInputs: ["adjustedCost", "volatilityPercent"],
    outputHint: "currency",
  },
  "cost.minimum_safe_price": {
    description: "Minimum safe price from P90 cost and target margin.",
    requiredInputs: ["p90Cost", "targetMarginPercent"],
    outputHint: "currency",
  },
  "yield.gap_value": {
    description: "Yield gap tonnage valued at price per ton.",
    requiredInputs: ["yieldGapTon", "pricePerTon"],
    outputHint: "currency",
  },
  "loss.waste_exposure": {
    description: "Ingredient waste cost from monthly spend and waste rate.",
    requiredInputs: ["monthlyIngredientCost", "wasteRate"],
    outputHint: "currency",
  },
  "loss.excess_waste_cost": {
    description: "Waste cost above target waste rate band.",
    requiredInputs: ["monthlyIngredientCost", "wasteRate", "targetWasteRate"],
    outputHint: "currency",
  },
  "cost.margin_pressure": {
    description: "Excess cost as percent of monthly revenue.",
    requiredInputs: ["excessCost", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "time.delay_cost": {
    description: "Daily site cost multiplied by delay days.",
    requiredInputs: ["dailySiteCost", "delayDays"],
    outputHint: "currency",
  },
  "cost.overrun_cost": {
    description: "Budget overrun from percent drift.",
    requiredInputs: ["budget", "overrunPercent"],
    outputHint: "currency",
  },
  "cost.total_exposure": {
    description: "Sum of three exposure components.",
    requiredInputs: ["a", "b", "c"],
    outputHint: "currency",
  },
  "time.rework_cost": {
    description: "Rework hours multiplied by labor rate.",
    requiredInputs: ["reworkHours", "laborRate"],
    outputHint: "currency",
  },
  "cost.food_cost_percent": {
    description: "Ingredient cost as percent of monthly revenue.",
    requiredInputs: ["ingredientCost", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "cost.delivery_fee_cost": {
    description: "Delivery platform fee from revenue and fee percent.",
    requiredInputs: ["monthlyRevenue", "deliveryAppFeePercent"],
    outputHint: "currency",
  },
  "cost.restaurant_margin_pressure": {
    description: "Combined ingredient, delivery and waste pressure on revenue.",
    requiredInputs: ["ingredientCost", "deliveryFeeCost", "wasteExposure", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "cost.variance": {
    description: "Positive variance of actual over planned cost.",
    requiredInputs: ["actual", "planned"],
    outputHint: "currency",
  },
  "route.distance_drift_cost": {
    description: "Fuel cost of distance driven above plan.",
    requiredInputs: ["plannedDistanceKm", "actualDistanceKm", "fuelCostPerKm"],
    outputHint: "currency",
  },
  "cost.sum2": {
    description: "Sum of two exposure components.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.total2": {
    description: "Total of two exposure components.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.value": {
    description: "Pass-through of a single numeric input to pipeline output.",
    requiredInputs: ["value"],
    outputHint: "currency",
  },
  "energy.compressor_leak_kwh": {
    description: "Compressor leak kWh from power, hours and leak percent.",
    requiredInputs: ["compressorKw", "leakPercent", "operatingHours"],
    outputHint: "number",
  },
  "cost.annualize": {
    description: "Monthly cost multiplied by twelve.",
    requiredInputs: ["monthlyCost"],
    outputHint: "currency",
  },
  "cloud.api_call_cost": {
    description: "API call volume cost from calls and per-thousand rate.",
    requiredInputs: ["monthlyApiCalls", "costPerThousandCalls"],
    outputHint: "currency",
  },
  "agriculture.yield_loss_revenue": {
    description: "Revenue lost from yield gap per hectare.",
    requiredInputs: ["areaHa", "expectedYieldTonPerHa", "actualYieldTonPerHa", "pricePerTon"],
    outputHint: "currency",
  },
};

function buildFormulaRegistryMeta(): FormulaRegistryMeta[] {
  return listRegisteredFormulaIds().map((formulaId) => {
    const canonicalId = LEGACY_ALIASES[formulaId] ?? formulaId;
    const meta = FORMULA_META[formulaId];
    const details = FORMULA_META_DETAILS[canonicalId];
    if (!meta || !details) {
      throw new Error(`Missing formula metadata for "${formulaId}"`);
    }
    return {
      formulaId,
      family: meta.family,
      label: meta.label,
      description: details.description,
      requiredInputs: details.requiredInputs,
      outputHint: details.outputHint,
    };
  });
}

export const FORMULA_REGISTRY_META: readonly FormulaRegistryMeta[] = buildFormulaRegistryMeta();

export function getFormulaRegistryMeta(formulaId: string): FormulaRegistryMeta | null {
  return FORMULA_REGISTRY_META.find((item) => item.formulaId === formulaId) ?? null;
}
