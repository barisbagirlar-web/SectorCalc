/**
 * Batch premium batch-3 oracle baselines - Phase 5G-D.
 * Independent reference implementations; does NOT import production calculators.
 */

import {
  OracleValidationError,
  type AutoShopMarginLeakOracleInput,
  type HvacProjectMarginGuardOracleInput,
  type LandscapingContractProfitOracleInput,
  type MillworkBidRiskOracleInput,
  type PaintingJobProfitVerdictOracleInput,
  type PanelShopMarginVerdictOracleInput,
  type PremiumMarginOracleOutput,
  type RoofingContractMarginGuardOracleInput,
  type SheetMetalQuoteRiskOracleInput,
  type SignageBidSafePriceOracleInput,
  type ThreeDPrintCostOracleInput,
  type ThreeDPrintCostOracleOutput,
} from "@/lib/features/formula-governance/oracle/oracle-types";

const Z_P90 = 1.2816;

const MARGIN_CORE_CONFIG = {
  "hvac-project-margin-guard": {
    hiddenMultiplier: 1.03 * 1.12 * 1.04,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.12,
    targetMarginDefault: 0.22,
  },
  "panel-shop-margin-verdict": {
    hiddenMultiplier: 1.04 * 1.08 * 1.06,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.11,
    targetMarginDefault: 0.24,
  },
  "landscaping-contract-profit-tool": {
    hiddenMultiplier: 1.08 * 1.07 * 1.05,
    toleranceMultiplier: 1.06,
    volatilityDefault: 0.1,
    targetMarginDefault: 0.2,
  },
  "auto-shop-margin-leak-detector": {
    hiddenMultiplier: 1.05 * 1.05 * 1.03,
    toleranceMultiplier: 1.12,
    volatilityDefault: 0.12,
    targetMarginDefault: 0.2,
  },
  "signage-bid-safe-price-tool": {
    hiddenMultiplier: 1.04 * 1.08 * 1.05,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.11,
    targetMarginDefault: 0.28,
  },
  "millwork-bid-risk-analyzer": {
    hiddenMultiplier: 1.12 * 1.1 * 1.06,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.13,
    targetMarginDefault: 0.26,
  },
  "roofing-contract-margin-guard": {
    hiddenMultiplier: 1.06 * 1.03 * 1.05,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.14,
    targetMarginDefault: 0.22,
  },
  "painting-job-profit-verdict": {
    hiddenMultiplier: 1.06 * 1.08 * 1.05,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.11,
    targetMarginDefault: 0.24,
  },
  "sheet-metal-quote-risk-tool": {
    hiddenMultiplier: 1.1 * 1.05 * 1.06,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.12,
    targetMarginDefault: 0.25,
  },
} as const;

type MarginCoreSlug = keyof typeof MARGIN_CORE_CONFIG;

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

function pct(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.min(Math.max(value, 0), 100);
}

function marginToDecimal(raw: number, fallback: number): number {
  if (!Number.isFinite(raw) || raw <= 0) {
    return fallback;
  }
  return raw > 1 ? Math.min(raw, 95) / 100 : Math.min(raw, 0.95);
}

function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function applyMarginCoreFloor(
  slug: MarginCoreSlug,
  baseCost: number,
  targetMargin: number,
): PremiumMarginOracleOutput {
  const config = MARGIN_CORE_CONFIG[slug];
  const target = marginToDecimal(targetMargin, config.targetMarginDefault);
  const adjustedCost = baseCost * config.hiddenMultiplier * config.toleranceMultiplier;
  const volatilityBuffer = adjustedCost * config.volatilityDefault * Z_P90;
  const p90Cost = adjustedCost + volatilityBuffer;
  const marginDenom = Math.max(0.05, 1 - target);
  const minimumSafePrice = p90Cost / marginDenom;

  return {
    baseCost: round(baseCost),
    p90Cost: round(p90Cost),
    minimumSafePrice: round(minimumSafePrice),
  };
}

/** HVAC project base cost + MarginCore safe price floor. */
export function calculateHvacProjectMarginGuardOracle(
  input: HvacProjectMarginGuardOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.equipmentCost, "Equipment cost");
  assertNonNegative(input.ductworkCost, "Ductwork cost");
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.commissioningCost, "Commissioning cost");

  const laborCost = input.laborHours * input.laborRate;
  const callbackRisk = pct(input.callbackRiskPercent, 8);
  const base =
    input.equipmentCost +
    input.ductworkCost +
    laborCost +
    input.commissioningCost;
  const callback = input.equipmentCost * (callbackRisk / 100);
  const refrigerant = input.equipmentCost * 0.03;
  const seasonal = laborCost * 0.2;
  const baseCost = base + callback + refrigerant + seasonal;

  return applyMarginCoreFloor("hvac-project-margin-guard", baseCost, input.targetMargin);
}

/** Electrical panel base cost + MarginCore safe bid floor. */
export function calculatePanelShopMarginVerdictOracle(
  input: PanelShopMarginVerdictOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.testingHours, "Testing hours");

  const laborCost = input.laborHours * input.laborRate;
  const testing = input.testingHours * input.laborRate;
  const permit = input.materialCost * 0.04;
  const inspection = pct(input.inspectionRiskPercent, 10);
  const base = input.materialCost + laborCost + testing + permit;
  const baseCost = base * (1 + inspection / 100);

  return applyMarginCoreFloor("panel-shop-margin-verdict", baseCost, input.targetMargin);
}

/** Landscaping contract monthly base cost + MarginCore floor. */
export function calculateLandscapingContractProfitOracle(
  input: LandscapingContractProfitOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.crewHoursPerVisit, "Crew hours per visit");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.fuelCostPerVisit, "Fuel cost per visit");
  assertNonNegative(input.supplyCostPerMonth, "Supply cost per month");
  assertNonNegative(input.visitsPerMonth, "Visits per month");
  assertNonNegative(input.equipmentWearCost, "Equipment wear cost");

  const laborCost = input.crewHoursPerVisit * input.laborRate * input.visitsPerMonth;
  const fuel = input.fuelCostPerVisit * input.visitsPerMonth;
  const equipDep = laborCost * 0.08;
  const baseCost =
    laborCost + fuel + input.supplyCostPerMonth + input.equipmentWearCost + equipDep;

  return applyMarginCoreFloor("landscaping-contract-profit-tool", baseCost, input.targetMargin);
}

/** Auto shop job base cost + MarginCore safe quote floor. */
export function calculateAutoShopMarginLeakOracle(
  input: AutoShopMarginLeakOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.diagnosticHours, "Diagnostic hours");
  assertNonNegative(input.repairHours, "Repair hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.partsCost, "Parts cost");

  const laborCost = (input.diagnosticHours + input.repairHours) * input.laborRate;
  const partsMarkup = pct(input.partsMarkupPercent, 30);
  const comeback = pct(input.comebackRiskPercent, 12);
  const parts = input.partsCost * (1 + partsMarkup / 100);
  const supplies = laborCost * 0.05;
  const base = laborCost + parts + supplies + input.partsCost * 0.12;
  const baseCost = base * (1 + comeback / 100);

  return applyMarginCoreFloor(
    "auto-shop-margin-leak-detector",
    baseCost,
    input.targetMargin ?? 0,
  );
}

/** Signage bid base cost + MarginCore safe price floor. */
export function calculateSignageBidSafePriceOracle(
  input: SignageBidSafePriceOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.inkCost, "Ink cost");
  assertNonNegative(input.designHours, "Design hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.installHours, "Install hours");

  const labor = (input.designHours + input.installHours) * input.laborRate;
  const base = input.materialCost + input.inkCost + labor;
  const rip = base * 0.04;
  const reprint = pct(input.reprintRiskPercent, 8);
  const baseCost = (base + rip) * (1 + reprint / 100);

  return applyMarginCoreFloor("signage-bid-safe-price-tool", baseCost, input.targetMargin);
}

/** Millwork bid base cost + MarginCore floor. */
export function calculateMillworkBidRiskOracle(
  input: MillworkBidRiskOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.sheetMaterialCost, "Sheet material cost");
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.finishingCost, "Finishing cost");
  assertNonNegative(input.installHours, "Install hours");

  const waste = Math.max(pct(input.wasteRatePercent, 12), 10);
  const material = input.sheetMaterialCost * (1 + waste / 100);
  const labor = (input.laborHours + input.installHours) * input.laborRate;
  const finishingDelay = input.finishingCost * 0.1;
  const baseCost = material + labor + input.finishingCost + finishingDelay;

  return applyMarginCoreFloor("millwork-bid-risk-analyzer", baseCost, input.targetMargin);
}

/** Roofing contract base cost + MarginCore floor. */
export function calculateRoofingContractMarginGuardOracle(
  input: RoofingContractMarginGuardOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.tearOffCost, "Tear-off cost");
  assertNonNegative(input.dumpFees, "Dump fees");

  const laborCost = input.laborHours * input.laborRate;
  const weather = pct(input.weatherDelayRiskPercent, 10);
  const base = input.materialCost + laborCost + input.tearOffCost + input.dumpFees;
  const reserves = input.materialCost * 0.14;
  const baseCost = (base + reserves) * (1 + weather / 100);

  return applyMarginCoreFloor("roofing-contract-margin-guard", baseCost, input.targetMargin);
}

/** Painting job base cost + MarginCore floor. */
export function calculatePaintingJobProfitVerdictOracle(
  input: PaintingJobProfitVerdictOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.paintCost, "Paint cost");
  assertNonNegative(input.prepHours, "Prep hours");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.scaffoldCost, "Scaffold cost");
  assertNonNegative(input.areaSize, "Area size");

  const productionHours = input.areaSize / 350;
  const labor = (input.prepHours + productionHours) * input.laborRate;
  const caulk = input.areaSize * 0.08;
  const touchUp = pct(input.touchUpRiskPercent, 8);
  const base = input.paintCost + labor + input.scaffoldCost + caulk;
  const baseCost = base * (1 + touchUp / 100);

  return applyMarginCoreFloor("painting-job-profit-verdict", baseCost, input.targetMargin);
}

/** Sheet metal quote base cost + MarginCore floor. */
export function calculateSheetMetalQuoteRiskOracle(
  input: SheetMetalQuoteRiskOracleInput,
): PremiumMarginOracleOutput {
  assertNonNegative(input.programmingTime, "Programming time");
  assertNonNegative(input.setupTime, "Setup time");
  assertNonNegative(input.cutTime, "Cut time");
  assertNonNegative(input.bendCount, "Bend count");
  assertNonNegative(input.laborRate, "Labor rate");
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.finishingCost, "Finishing cost");

  const scrap = Math.max(pct(input.scrapRatePercent, 8), 8);
  const totalMinutes =
    input.programmingTime + input.setupTime + input.cutTime + input.bendCount * 2;
  const laborCost = (totalMinutes / 60) * input.laborRate;
  const material = input.materialCost * (1 + scrap / 100);
  const baseCost = laborCost + material + input.finishingCost;

  return applyMarginCoreFloor("sheet-metal-quote-risk-tool", baseCost, input.targetMargin);
}

/** Free-traffic 3D print visible cost. */
export function calculate3dPrintCostOracle(
  input: ThreeDPrintCostOracleInput,
): ThreeDPrintCostOracleOutput {
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.printHours, "Print hours");
  assertNonNegative(input.machineRate, "Machine rate");
  assertNonNegative(input.postProcessHours, "Post-process hours");
  assertNonNegative(input.laborRate, "Labor rate");

  const machineTimeCost = input.printHours * input.machineRate;
  const postProcessCost = input.postProcessHours * input.laborRate;
  const estimatedCost = input.materialCost + machineTimeCost + postProcessCost;

  return {
    estimatedCost: round(estimatedCost),
    machineTimeCost: round(machineTimeCost),
  };
}

export const BATCH_PREMIUM_BATCH3_ORACLE_SLUGS = [
  "hvac-project-margin-guard",
  "panel-shop-margin-verdict",
  "landscaping-contract-profit-tool",
  "auto-shop-margin-leak-detector",
  "signage-bid-safe-price-tool",
  "millwork-bid-risk-analyzer",
  "roofing-contract-margin-guard",
  "painting-job-profit-verdict",
  "sheet-metal-quote-risk-tool",
  "3d-print-cost-check",
] as const;

export type BatchPremiumBatch3OracleSlug = (typeof BATCH_PREMIUM_BATCH3_ORACLE_SLUGS)[number];

export const BATCH_PREMIUM_BATCH3_ORACLE_TOOL_IDS: Record<BatchPremiumBatch3OracleSlug, string> = {
  "hvac-project-margin-guard": "revenue-premium.hvac-project-margin-guard",
  "panel-shop-margin-verdict": "revenue-premium.panel-shop-margin-verdict",
  "landscaping-contract-profit-tool": "revenue-premium.landscaping-contract-profit-tool",
  "auto-shop-margin-leak-detector": "revenue-premium.auto-shop-margin-leak-detector",
  "signage-bid-safe-price-tool": "revenue-premium.signage-bid-safe-price-tool",
  "millwork-bid-risk-analyzer": "revenue-premium.millwork-bid-risk-analyzer",
  "roofing-contract-margin-guard": "revenue-premium.roofing-contract-margin-guard",
  "painting-job-profit-verdict": "revenue-premium.painting-job-profit-verdict",
  "sheet-metal-quote-risk-tool": "revenue-premium.sheet-metal-quote-risk-tool",
  "3d-print-cost-check": "free-traffic.3d-print-cost-check",
};

export function isBatchPremiumBatch3OracleSlug(slug: string): slug is BatchPremiumBatch3OracleSlug {
  return (BATCH_PREMIUM_BATCH3_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getBatchPremiumBatch3OracleToolId(slug: BatchPremiumBatch3OracleSlug): string {
  return BATCH_PREMIUM_BATCH3_ORACLE_TOOL_IDS[slug];
}
