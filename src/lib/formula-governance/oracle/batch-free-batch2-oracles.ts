/**
 * Batch free/revenue calculator oracle baselines — Phase 5G-B.
 * Independent reference implementations; does NOT import production calculators.
 */

import {
  OracleValidationError,
  type CabinetCostOracleInput,
  type CabinetCostOracleOutput,
  type ElectricalLaborOracleInput,
  type ElectricalLaborOracleOutput,
  type HvacTonnageRuleOracleInput,
  type HvacTonnageRuleOracleOutput,
  type LaserCuttingTimeOracleInput,
  type LaserCuttingTimeOracleOutput,
  type LawnCareCostOracleInput,
  type LawnCareCostOracleOutput,
  type PlumbingJobMarginOracleInput,
  type PlumbingJobMarginOracleOutput,
  type PrintJobCostOracleInput,
  type PrintJobCostOracleOutput,
  type RepairTimeVsPriceOracleInput,
  type RepairTimeVsPriceOracleOutput,
  type RoofingSquareCostOracleInput,
  type RoofingSquareCostOracleOutput,
  type SampleSizeOracleInput,
  type SampleSizeOracleOutput,
} from "@/lib/formula-governance/oracle/oracle-types";

const Z_P90 = 1.2816;
const PLUMBING_HIDDEN_MULTIPLIER = 1.15 * 1.05 * 1.1;
const PLUMBING_TOLERANCE_MULTIPLIER = 1.1;
const PLUMBING_VOLATILITY_DEFAULT = 0.12;

function assertNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new OracleValidationError("INVALID_COST", `${label} must be a non-negative finite number.`);
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError("INVALID_PRICE", `${label} must be a positive finite number.`);
  }
}

function assertPercent(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new OracleValidationError("INVALID_PERCENT", `${label} must be between 0 and 100 percent.`);
  }
}

function safeDivide(a: number, b: number): number {
  if (b === 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
    return 0;
  }
  const result = a / b;
  return Number.isFinite(result) ? result : 0;
}

function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function marginToDecimal(raw: number, fallback: number): number {
  if (!Number.isFinite(raw) || raw <= 0) {
    return fallback;
  }
  return raw > 1 ? Math.min(raw, 95) / 100 : Math.min(raw, 0.95);
}

/** Cochran sample size with finite population correction. */
export function calculateSampleSizeOracle(input: SampleSizeOracleInput): SampleSizeOracleOutput {
  assertNonNegative(input.population, "Population");
  assertPositive(input.confidenceZ, "Confidence z-score");
  assertPositive(input.marginErrorPercent, "Margin of error percent");
  assertPercent(input.proportionPercent, "Proportion percent");

  const margin = input.marginErrorPercent / 100;
  const proportion = input.proportionPercent / 100;
  const n0 = safeDivide(
    input.confidenceZ * input.confidenceZ * proportion * (1 - proportion),
    margin * margin,
  );
  const requiredSample =
    input.population > 0
      ? safeDivide(n0, 1 + safeDivide(n0 - 1, input.population))
      : n0;

  return {
    requiredSample: Math.ceil(requiredSample),
    infinitePopulationEstimate: Math.ceil(n0),
  };
}

/** ASHRAE simplified tonnage with free-tier defaults. */
export function calculateHvacTonnageRuleOracle(
  input: HvacTonnageRuleOracleInput,
): HvacTonnageRuleOracleOutput {
  assertPositive(input.squareFootage, "Square footage");
  assertNonNegative(input.tonnage, "Tonnage");
  assertNonNegative(input.laborHours, "Labor hours");

  const occupancyCount = Math.max(2, Math.round(input.squareFootage / 400));
  const buildingLoad = input.squareFootage * 25 * 1.0;
  const windowLoad = input.squareFootage * 0.15 * 100;
  const occupancyLoad = occupancyCount * 600;
  const totalBtu = Math.round(buildingLoad + windowLoad + occupancyLoad);
  const totalTons = Math.round((totalBtu / 12000) * 100) / 100;
  const recommendedTons = Math.ceil(totalTons);

  return { totalBtu, totalTons, recommendedTons };
}

/** NEC labor/material ratio quick check. */
export function calculateElectricalLaborOracle(
  input: ElectricalLaborOracleInput,
): ElectricalLaborOracleOutput {
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.laborRate, "Labor rate");

  const effectiveRate = Math.max(input.laborRate, 1);
  const laborCost = input.laborHours * effectiveRate;
  const laborMaterialRatio =
    input.materialCost > 0 ? (laborCost / input.materialCost) * 100 : 0;

  return { laborCost, laborMaterialRatio };
}

/** NALP route crew-hour load. */
export function calculateLawnCareCostOracle(
  input: LawnCareCostOracleInput,
): LawnCareCostOracleOutput {
  if (input.crewHoursPerVisit < 0 || input.visitsPerMonth < 0) {
    throw new OracleValidationError("INVALID_HOURS", "Crew hours and visits cannot be negative.");
  }
  assertNonNegative(input.laborRate, "Labor rate");

  const monthlyLoad = input.crewHoursPerVisit * input.visitsPerMonth;
  const monthlyLaborCost = monthlyLoad * Math.max(input.laborRate, 0);

  return { monthlyLoad, monthlyLaborCost };
}

/** Mitchell guide burdened repair cost. */
export function calculateRepairTimeVsPriceOracle(
  input: RepairTimeVsPriceOracleInput,
): RepairTimeVsPriceOracleOutput {
  assertNonNegative(input.quotedPrice, "Quoted price");
  assertNonNegative(input.repairHours, "Repair hours");
  assertNonNegative(input.partsCost, "Parts cost");

  const shopRate = input.shopRate > 0 ? input.shopRate : 80;
  const mitchellBaseHours = 1.2;
  const mitchellTotalHours = mitchellBaseHours * 1.0 * 1.0;
  const visibleCost = input.repairHours * shopRate + input.partsCost;
  const diagnosticAllowance = shopRate * 0.75;
  const burdenedCost = visibleCost + diagnosticAllowance;

  return {
    visibleCost,
    burdenedCost,
    mitchellTotalHours,
  };
}

/** SGIA design/material ratio. */
export function calculatePrintJobCostOracle(
  input: PrintJobCostOracleInput,
): PrintJobCostOracleOutput {
  assertNonNegative(input.designHours, "Design hours");
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.laborRate, "Labor rate");

  const designCost = input.designHours * Math.max(input.laborRate, 1);
  const designMaterialRatio = input.materialCost > 0 ? designCost / input.materialCost : 0;

  return { designCost, designMaterialRatio };
}

/** Premium plumbing base cost + decision-layer safe price floor. */
export function calculatePlumbingJobMarginOracle(
  input: PlumbingJobMarginOracleInput,
): PlumbingJobMarginOracleOutput {
  assertNonNegative(input.partsCost, "Parts cost");
  assertPositive(input.laborHours, "Labor hours");
  assertPositive(input.laborRate, "Labor rate");
  assertNonNegative(input.fixtureCount, "Fixture count");
  assertNonNegative(input.materialRunCost, "Material run cost");
  assertPercent(input.callbackRiskPercent, "Callback risk percent");
  if (input.targetMargin < 1 || input.targetMargin > 80) {
    throw new OracleValidationError("INVALID_PERCENT", "Target margin must be between 1% and 80%.");
  }

  const laborCost = input.laborHours * input.laborRate;
  const access = laborCost * 0.15;
  const permit = laborCost * 0.1;
  const base =
    input.partsCost +
    laborCost +
    input.materialRunCost +
    input.fixtureCount * 25 +
    access +
    permit;
  const baseCost = base * (1 + input.callbackRiskPercent / 100);

  const targetMargin = marginToDecimal(input.targetMargin, 0.25);
  const adjustedCost = baseCost * PLUMBING_HIDDEN_MULTIPLIER * PLUMBING_TOLERANCE_MULTIPLIER;
  const volatilityBuffer = adjustedCost * PLUMBING_VOLATILITY_DEFAULT * Z_P90;
  const p90Cost = adjustedCost + volatilityBuffer;
  const marginDenom = Math.max(0.05, 1 - targetMargin);
  const minimumSafePrice = p90Cost / marginDenom;

  return {
    baseCost: round(baseCost),
    p90Cost: round(p90Cost),
    minimumSafePrice: round(minimumSafePrice),
  };
}

/** WWPA waste-adjusted millwork hours. */
export function calculateCabinetCostOracle(
  input: CabinetCostOracleInput,
): CabinetCostOracleOutput {
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.installHours, "Install hours");
  assertNonNegative(input.sheetMaterialCost, "Sheet material cost");

  const totalHours = input.laborHours + input.installHours;
  const wasteAdjustedHours = totalHours * 1.12;

  return { totalHours, wasteAdjustedHours };
}

/** NRCA square cost with labor/material ratio. */
export function calculateRoofingSquareCostOracle(
  input: RoofingSquareCostOracleInput,
): RoofingSquareCostOracleOutput {
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.materialCost, "Material cost");

  const effectiveRate = Math.max(input.laborRate, 1);
  const laborCost = input.laborHours * effectiveRate;
  const estimatedSqFt =
    input.materialCost > 0
      ? (input.materialCost / 350) * 100
      : Math.max(1000, input.laborHours * 80);
  const squares = estimatedSqFt / 100;
  const pitchFactor = 1.1;
  const heightFactor = 1.0;
  const materialNrca = squares * 350 * pitchFactor;
  const laborNrca = squares * 300 * pitchFactor * heightFactor;
  const removalCost = squares * 100;
  const wasteAllowance = (materialNrca + laborNrca) * 0.1;
  const nrcaEstimate = materialNrca + laborNrca + removalCost + wasteAllowance;
  const laborMaterialRatio =
    input.materialCost > 0 ? (laborCost / input.materialCost) * 100 : 0;

  return {
    laborCost,
    nrcaEstimate: round(nrcaEstimate),
    laborMaterialRatio,
  };
}

/** Free-traffic laser path: setup + cut length ÷ speed + pierce time. */
export function calculateLaserCuttingTimeOracle(
  input: LaserCuttingTimeOracleInput,
): LaserCuttingTimeOracleOutput {
  assertPositive(input.setupMinutes, "Setup minutes");
  assertPositive(input.cutLengthM, "Cut length");
  assertPositive(input.cutSpeedMMin, "Cut speed");
  assertNonNegative(input.pierceCount, "Pierce count");
  assertNonNegative(input.pierceSeconds, "Pierce seconds");

  const cutMinutes = safeDivide(input.cutLengthM, input.cutSpeedMMin);
  const pierceMinutes = (input.pierceCount * input.pierceSeconds) / 60;
  const totalMinutes = input.setupMinutes + cutMinutes + pierceMinutes;

  return { totalMinutes: round(totalMinutes), cutMinutes: round(cutMinutes) };
}

export const BATCH_FREE_BATCH2_ORACLE_SLUGS = [
  "sample-size-calculator",
  "hvac-tonnage-rule-check",
  "electrical-labor-estimator",
  "lawn-care-cost-check",
  "repair-time-vs-price-check",
  "print-job-cost-check",
  "plumbing-job-margin-verdict",
  "cabinet-cost-estimator",
  "roofing-square-cost-check",
  "laser-cutting-time-check",
] as const;

export type BatchFreeBatch2OracleSlug = (typeof BATCH_FREE_BATCH2_ORACLE_SLUGS)[number];

export const BATCH_FREE_BATCH2_ORACLE_TOOL_IDS: Record<BatchFreeBatch2OracleSlug, string> = {
  "sample-size-calculator": "free-traffic.sample-size-calculator",
  "hvac-tonnage-rule-check": "revenue-free.hvac-tonnage-rule-check",
  "electrical-labor-estimator": "revenue-free.electrical-labor-estimator",
  "lawn-care-cost-check": "revenue-free.lawn-care-cost-check",
  "repair-time-vs-price-check": "revenue-free.repair-time-vs-price-check",
  "print-job-cost-check": "revenue-free.print-job-cost-check",
  "plumbing-job-margin-verdict": "revenue-premium.plumbing-job-margin-verdict",
  "cabinet-cost-estimator": "revenue-free.cabinet-cost-estimator",
  "roofing-square-cost-check": "revenue-free.roofing-square-cost-check",
  "laser-cutting-time-check": "free-traffic.laser-cutting-time-check",
};

export function isBatchFreeBatch2OracleSlug(slug: string): slug is BatchFreeBatch2OracleSlug {
  return (BATCH_FREE_BATCH2_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getBatchFreeBatch2OracleToolId(slug: BatchFreeBatch2OracleSlug): string {
  return BATCH_FREE_BATCH2_ORACLE_TOOL_IDS[slug];
}
