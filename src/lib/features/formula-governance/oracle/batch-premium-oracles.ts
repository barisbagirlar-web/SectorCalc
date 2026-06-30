/**
 * Batch premium/revenue analyzer oracle baselines — Phase 5F-B.
 * Independent reference implementations; does NOT import production calculators.
 */

import {
  OracleValidationError,
  type ChangeOrderImpactOracleInput,
  type ChangeOrderImpactOracleOutput,
  type MenuProfitLeakDetectorOracleInput,
  type MenuProfitLeakDetectorOracleOutput,
  type OfficeCleaningBidOptimizerOracleInput,
  type OfficeCleaningBidOptimizerOracleOutput,
  type ReturnProfitErosionOracleInput,
  type ReturnProfitErosionOracleOutput,
  type WeldingBidRiskOracleInput,
  type WeldingBidRiskOracleOutput,
} from "@/lib/features/formula-governance/oracle/oracle-types";

const Z_P90 = 1.2816;
const WELDING_HIDDEN_MULTIPLIER = 1.15 * 1.08 * 1.06;
const WELDING_TOLERANCE_MULTIPLIER = 1.1;
const WELDING_VOLATILITY_DEFAULT = 0.13;
const WELDING_TARGET_MARGIN_DEFAULT = 0.25;

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

function priceForMargin(directCost: number, marginPercent: number): number {
  if (marginPercent >= 100) {
    return directCost;
  }
  return directCost / (1 - marginPercent / 100);
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

/** Reference change order: labor + material + equipment + delay overhead; safe price at target margin. */
export function calculateChangeOrderImpactOracle(
  input: ChangeOrderImpactOracleInput,
): ChangeOrderImpactOracleOutput {
  assertNonNegative(input.originalContractValue, "Original contract value");
  assertNonNegative(input.originalEstimatedCost, "Original estimated cost");
  assertNonNegative(input.extraLaborHours, "Extra labor hours");
  assertNonNegative(input.laborHourlyRate, "Labor hourly rate");
  assertNonNegative(input.extraMaterialCost, "Extra material cost");
  assertNonNegative(input.extraEquipmentCost, "Extra equipment cost");
  assertNonNegative(input.delayDays, "Delay days");
  assertNonNegative(input.dailyOverheadCost, "Daily overhead cost");
  assertNonNegative(input.customerOfferedPrice, "Customer offered price");
  if (input.targetChangeMargin < 1 || input.targetChangeMargin > 80) {
    throw new OracleValidationError(
      "INVALID_PERCENT",
      "Target change margin must be between 1% and 80%.",
    );
  }

  const extraLaborCost = input.extraLaborHours * input.laborHourlyRate;
  const delayCost = input.delayDays * input.dailyOverheadCost;
  const extraDirectCost =
    extraLaborCost + input.extraMaterialCost + input.extraEquipmentCost + delayCost;
  const minimumSafeChangePrice = priceForMargin(extraDirectCost, input.targetChangeMargin);

  return { extraLaborCost, delayCost, extraDirectCost, minimumSafeChangePrice };
}

/** Reference office cleaning bid: monthly labor + supplies + travel + overhead; safe bid at margin. */
export function calculateOfficeCleaningBidOptimizerOracle(
  input: OfficeCleaningBidOptimizerOracleInput,
): OfficeCleaningBidOptimizerOracleOutput {
  assertPositive(input.area, "Area");
  assertPositive(input.frequencyPerMonth, "Frequency per month");
  assertPositive(input.hoursPerVisit, "Hours per visit");
  if (!Number.isFinite(input.crewSize) || input.crewSize < 1) {
    throw new OracleValidationError("INVALID_CREW", "Crew size must be at least 1.");
  }
  assertNonNegative(input.laborHourlyCost, "Labor hourly cost");
  assertNonNegative(input.suppliesCostPerVisit, "Supplies cost per visit");
  assertNonNegative(input.travelCostPerVisit, "Travel cost per visit");
  assertNonNegative(input.monthlyOverhead, "Monthly overhead");
  assertNonNegative(input.customerBudget, "Customer budget");
  if (input.targetMargin < 1 || input.targetMargin > 80) {
    throw new OracleValidationError("INVALID_PERCENT", "Target margin must be between 1% and 80%.");
  }

  const monthlyLaborCost =
    input.frequencyPerMonth * input.hoursPerVisit * input.crewSize * input.laborHourlyCost;
  const monthlySuppliesCost = input.frequencyPerMonth * input.suppliesCostPerVisit;
  const monthlyTravelCost = input.frequencyPerMonth * input.travelCostPerVisit;
  const monthlyDirectCost =
    monthlyLaborCost + monthlySuppliesCost + monthlyTravelCost + input.monthlyOverhead;
  const minimumSafeMonthlyBid = priceForMargin(monthlyDirectCost, input.targetMargin);
  const profitAtBudget = input.customerBudget - monthlyDirectCost;
  const marginAtBudget =
    input.customerBudget > 0 ? (profitAtBudget / input.customerBudget) * 100 : 0;

  return { monthlyDirectCost, minimumSafeMonthlyBid, marginAtBudget };
}

/** Reference menu item economics: waste-inflated ingredients, commission, labor; margin and safe price. */
export function calculateMenuProfitLeakDetectorOracle(
  input: MenuProfitLeakDetectorOracleInput,
): MenuProfitLeakDetectorOracleOutput {
  assertNonNegative(input.sellingPrice, "Selling price");
  assertNonNegative(input.ingredientCost, "Ingredient cost");
  assertPercent(input.wasteRate, "Waste rate");
  assertNonNegative(input.packagingCost, "Packaging cost");
  assertNonNegative(input.laborCostPerItem, "Labor cost per item");
  assertPercent(input.deliveryCommissionRate, "Delivery commission rate");
  if (input.targetMargin < 1 || input.targetMargin > 95) {
    throw new OracleValidationError("INVALID_PERCENT", "Target margin must be between 1% and 95%.");
  }
  if (!Number.isFinite(input.monthlyUnitsSold) || input.monthlyUnitsSold < 1) {
    throw new OracleValidationError("INVALID_COST", "Monthly units sold must be at least 1.");
  }

  const adjustedIngredientCost = input.ingredientCost * (1 + input.wasteRate / 100);
  const deliveryCommission = input.sellingPrice * (input.deliveryCommissionRate / 100);
  const totalCostPerItem =
    adjustedIngredientCost + input.packagingCost + input.laborCostPerItem + deliveryCommission;
  const grossProfitPerItem = input.sellingPrice - totalCostPerItem;
  const actualMargin =
    input.sellingPrice > 0 ? (grossProfitPerItem / input.sellingPrice) * 100 : 0;
  const minimumSafePrice = priceForMargin(totalCostPerItem, input.targetMargin);

  return { totalCostPerItem, actualMargin, minimumSafePrice, grossProfitPerItem };
}

/** Reference return erosion: fees, return drag, ad cost; net profit and target-margin price. */
export function calculateReturnProfitErosionOracle(
  input: ReturnProfitErosionOracleInput,
): ReturnProfitErosionOracleOutput {
  assertPositive(input.sellingPrice, "Selling price");
  assertNonNegative(input.productCost, "Product cost");
  assertNonNegative(input.shippingCost, "Shipping cost");
  assertPercent(input.platformFeeRate, "Platform fee rate");
  assertPercent(input.paymentFeeRate, "Payment fee rate");
  assertPercent(input.returnRate, "Return rate");
  assertNonNegative(input.returnHandlingCost, "Return handling cost");
  assertNonNegative(input.adCostPerOrder, "Ad cost per order");
  if (input.targetMargin < 1 || input.targetMargin > 80) {
    throw new OracleValidationError("INVALID_PERCENT", "Target margin must be between 1% and 80%.");
  }

  const platformFee = input.sellingPrice * (input.platformFeeRate / 100);
  const paymentFee = input.sellingPrice * (input.paymentFeeRate / 100);
  const expectedReturnLoss =
    (input.sellingPrice + input.returnHandlingCost) * (input.returnRate / 100);
  const totalCost =
    input.productCost +
    input.shippingCost +
    platformFee +
    paymentFee +
    expectedReturnLoss +
    input.adCostPerOrder;
  const netProfit = input.sellingPrice - totalCost;
  const netMargin = input.sellingPrice > 0 ? (netProfit / input.sellingPrice) * 100 : 0;
  const requiredPriceForTargetMargin = priceForMargin(totalCost, input.targetMargin);

  return {
    netProfit,
    netMargin,
    returnImpact: expectedReturnLoss,
    requiredPriceForTargetMargin,
  };
}

/** Reference welding bid: fit-up premium, shop buffer, rework; decision-layer safe bid floor. */
export function calculateWeldingBidRiskOracle(
  input: WeldingBidRiskOracleInput,
): WeldingBidRiskOracleOutput {
  assertPositive(input.materialCost, "Material cost");
  assertPositive(input.laborHours, "Labor hours");
  assertPositive(input.laborRate, "Labor rate");
  assertNonNegative(input.gasConsumableCost, "Gas consumable cost");
  assertNonNegative(input.fitUpHours, "Fit-up hours");
  assertPercent(input.reworkRiskPercent, "Rework risk percent");

  const fitUpCost = input.fitUpHours * input.laborRate * 1.35;
  const laborCost = input.laborHours * input.laborRate;
  const base = (input.materialCost + laborCost + input.gasConsumableCost + fitUpCost) * 1.15;
  const baseCost = base * (1 + input.reworkRiskPercent / 100);

  const targetMargin = marginToDecimal(input.targetMargin, WELDING_TARGET_MARGIN_DEFAULT);
  const adjustedCost = baseCost * WELDING_HIDDEN_MULTIPLIER * WELDING_TOLERANCE_MULTIPLIER;
  const volatilityBuffer = adjustedCost * WELDING_VOLATILITY_DEFAULT * Z_P90;
  const p90Cost = adjustedCost + volatilityBuffer;
  const marginDenom = Math.max(0.05, 1 - targetMargin);
  const minimumSafePrice = p90Cost / marginDenom;

  return {
    baseCost: round(baseCost),
    p90Cost: round(p90Cost),
    minimumSafePrice: round(minimumSafePrice),
  };
}

export const BATCH_PREMIUM_ORACLE_SLUGS = [
  "change-order-impact-analyzer",
  "office-cleaning-bid-optimizer",
  "menu-profit-leak-detector",
  "return-profit-erosion-tool",
  "welding-bid-risk-analyzer",
] as const;

export type BatchPremiumOracleSlug = (typeof BATCH_PREMIUM_ORACLE_SLUGS)[number];

export const BATCH_PREMIUM_ORACLE_TOOL_IDS: Record<BatchPremiumOracleSlug, string> = {
  "change-order-impact-analyzer": "revenue-premium.change-order-impact-analyzer",
  "office-cleaning-bid-optimizer": "revenue-premium.office-cleaning-bid-optimizer",
  "menu-profit-leak-detector": "revenue-premium.menu-profit-leak-detector",
  "return-profit-erosion-tool": "revenue-premium.return-profit-erosion-tool",
  "welding-bid-risk-analyzer": "revenue-premium.welding-bid-risk-analyzer",
};

export const BATCH_PREMIUM_CALCULATOR_IDS: Record<
  Exclude<BatchPremiumOracleSlug, "welding-bid-risk-analyzer">,
  string
> = {
  "change-order-impact-analyzer": "change-order-impact-analyzer",
  "office-cleaning-bid-optimizer": "office-cleaning-bid-optimizer",
  "menu-profit-leak-detector": "menu-profit-leak-detector",
  "return-profit-erosion-tool": "return-rate-profit-erosion-tool",
};

export function isBatchPremiumOracleSlug(slug: string): slug is BatchPremiumOracleSlug {
  return (BATCH_PREMIUM_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getBatchPremiumOracleToolId(slug: BatchPremiumOracleSlug): string {
  return BATCH_PREMIUM_ORACLE_TOOL_IDS[slug];
}
