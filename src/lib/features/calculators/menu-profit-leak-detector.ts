import type { ResultTone, ToolResult } from "@/data/tool-schema";
import { formatCurrency } from "@/lib/core/format/currency";
import {
 RISK_LEVEL_LABELS,
 DEFAULT_PREMIUM_ASSUMPTIONS,
 priceForMargin,
 type PremiumCalculatorPayload,
 type PremiumScenarioRow,
 type ScenarioTableLabels,
} from "@/lib/features/calculators/premium-types";

export interface MenuProfitLeakInput {
 sellingPrice: number;
 ingredientCost: number;
 wasteRate: number;
 packagingCost: number;
 laborCostPerItem: number;
 deliveryCommissionRate: number;
 targetMargin: number;
 monthlyUnitsSold: number;
}

export type MenuProfitLeakField = keyof MenuProfitLeakInput;

export type MenuProfitLeakErrors = Partial<Record<MenuProfitLeakField, string>>;

export interface MenuProfitLeakCore {
 adjustedIngredientCost: number;
 deliveryCommission: number;
 totalCostPerItem: number;
 grossProfitPerItem: number;
 actualMargin: number;
 monthlyProfit: number;
 minimumSafePrice: number;
 priceIncreaseNeeded: number;
 monthlyLeak: number;
}

export interface MenuProfitLeakOutput extends MenuProfitLeakCore {
 premium: PremiumCalculatorPayload;
}

const SCENARIO_LABELS: ScenarioTableLabels = {
 subtitle: "Compare minimum safe menu prices at lower, base and stronger margin targets.",
 metric: "Target margin",
 primary: "Min. safe price",
 secondary: "Item margin",
 profit: "Monthly profit",
};

function clampMenuMargin(margin: number): number {
 return Math.min(95, Math.max(40, margin));
}

export function validateMenuProfitLeak(
 input: MenuProfitLeakInput
): MenuProfitLeakErrors {
 const errors: MenuProfitLeakErrors = {};

 const nonNegative: MenuProfitLeakField[] = [
 "sellingPrice",
 "ingredientCost",
 "packagingCost",
 "laborCostPerItem",
 "monthlyUnitsSold",
 ];

 for (const field of nonNegative) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 if (Number.isNaN(input.monthlyUnitsSold) || input.monthlyUnitsSold < 1) {
 errors.monthlyUnitsSold = "Monthly units sold must be at least 1.";
 }

 if (
 Number.isNaN(input.wasteRate) ||
 input.wasteRate < 0 ||
 input.wasteRate > 100
 ) {
 errors.wasteRate = "Waste rate must be between 0% and 100%.";
 }

 if (
 Number.isNaN(input.deliveryCommissionRate) ||
 input.deliveryCommissionRate < 0 ||
 input.deliveryCommissionRate > 100
 ) {
 errors.deliveryCommissionRate =
 "Delivery commission must be between 0% and 100%.";
 }

 if (
 Number.isNaN(input.targetMargin) ||
 input.targetMargin < 1 ||
 input.targetMargin > 95
 ) {
 errors.targetMargin = "Target margin must be between 1% and 95%.";
 }

 return errors;
}

export function hasMenuProfitLeakValidationErrors(
 errors: MenuProfitLeakErrors
): boolean {
 return Object.keys(errors).length > 0;
}

function computeItemEconomics(input: MenuProfitLeakInput) {
 const adjustedIngredientCost =
 input.ingredientCost * (1 + input.wasteRate / 100);
 const deliveryCommission =
 input.sellingPrice * (input.deliveryCommissionRate / 100);
 const totalCostPerItem =
 adjustedIngredientCost +
 input.packagingCost +
 input.laborCostPerItem +
 deliveryCommission;
 const grossProfitPerItem = input.sellingPrice - totalCostPerItem;
 const actualMargin =
 input.sellingPrice > 0
 ? (grossProfitPerItem / input.sellingPrice) * 100
 : 0;

 return {
 adjustedIngredientCost,
 deliveryCommission,
 totalCostPerItem,
 grossProfitPerItem,
 actualMargin,
 };
}

function computeRisk(
 input: MenuProfitLeakInput,
 core: MenuProfitLeakCore
): { level: ResultTone; verdictText: string; recommendation: string } {
 if (
 core.grossProfitPerItem < 0 ||
 core.actualMargin < input.targetMargin - 15
 ) {
 return {
 level: "danger",
 verdictText:
 "High risk: this menu item may be losing money or far below target margin.",
 recommendation:
 "This menu item is materially underpriced based on your cost structure. Increase price, reduce cost or remove it from promotion.",
 };
 }

 if (core.actualMargin < input.targetMargin || core.priceIncreaseNeeded > 0) {
 return {
 level: "warning",
 verdictText:
 "Moderate risk: the item is profitable but below your target margin.",
 recommendation:
 "The item is profitable but below target margin. Review delivery commission, waste and portion cost.",
 };
 }

 return {
 level: "success",
 verdictText:
 "Safe range: the menu item appears healthy based on your cost inputs.",
 recommendation:
 "The item appears healthy based on your inputs. Continue monitoring ingredient and delivery costs.",
 };
}

function buildMarginScenarios(
 input: MenuProfitLeakInput,
 totalCostPerItem: number,
 monthlyUnitsSold: number
): PremiumScenarioRow[] {
 const margins = [
 {
 id: "low",
 label: "Lower margin target",
 margin: clampMenuMargin(input.targetMargin - 10),
 },
 { id: "base", label: "Base target", margin: input.targetMargin },
 {
 id: "strong",
 label: "Strong margin target",
 margin: clampMenuMargin(input.targetMargin + 10),
 },
 ];

 return margins.map(({ id, label, margin }) => {
 const minimumSafePrice = priceForMargin(totalCostPerItem, margin);
 const itemMargin =
 minimumSafePrice > 0
 ? ((minimumSafePrice - totalCostPerItem) / minimumSafePrice) * 100
 : 0;
 return {
 id,
 label,
 metricDisplay: `${margin}%`,
 primaryValue: minimumSafePrice,
 secondaryValue: itemMargin,
 secondaryFormat: "percent" as const,
 profitValue: (minimumSafePrice - totalCostPerItem) * monthlyUnitsSold,
 };
 });
}

function buildReport(
 input: MenuProfitLeakInput,
 core: MenuProfitLeakCore,
 riskLevel: ResultTone,
 recommendation: string
) {
 return {
 executiveSummary: `At ${formatCurrency(input.sellingPrice)} menu price, actual margin is ${core.actualMargin.toFixed(1)}% (${formatCurrency(core.grossProfitPerItem)} per item). Minimum safe price for ${input.targetMargin}% target is ${formatCurrency(core.minimumSafePrice)}. Estimated monthly profit leak: ${formatCurrency(core.monthlyLeak)}.`,
 keyFindings: [
 `Total cost per item: ${formatCurrency(core.totalCostPerItem)} (ingredients with waste, packaging, labor, delivery commission).`,
 `Delivery commission at ${input.deliveryCommissionRate}% costs ${formatCurrency(core.deliveryCommission)} per item.`,
 `Price increase needed for target margin: ${core.priceIncreaseNeeded > 0 ? formatCurrency(core.priceIncreaseNeeded) : "none at current price"}.`,
 `Monthly profit at current price: ${formatCurrency(core.monthlyProfit)} across ${input.monthlyUnitsSold} units.`,
 ],
 riskLevelLabel: RISK_LEVEL_LABELS[riskLevel],
 recommendation,
 assumptions: `${DEFAULT_PREMIUM_ASSUMPTIONS} Menu economics should also account for kitchen capacity, combo sales and third-party delivery mix.`,
 };
}

export function calculateMenuProfitLeak(
 input: MenuProfitLeakInput
): MenuProfitLeakOutput | null {
 const errors = validateMenuProfitLeak(input);
 if (hasMenuProfitLeakValidationErrors(errors)) return null;

 const economics = computeItemEconomics(input);
 const minimumSafePrice = priceForMargin(
 economics.totalCostPerItem,
 input.targetMargin
 );
 const priceIncreaseNeeded = minimumSafePrice - input.sellingPrice;
 const monthlyProfit = economics.grossProfitPerItem * input.monthlyUnitsSold;
 const monthlyLeak = Math.max(0, priceIncreaseNeeded) * input.monthlyUnitsSold;

 const core: MenuProfitLeakCore = {
 ...economics,
 monthlyProfit,
 minimumSafePrice,
 priceIncreaseNeeded,
 monthlyLeak,
 };

 const risk = computeRisk(input, core);
 const scenarios = buildMarginScenarios(
 input,
 economics.totalCostPerItem,
 input.monthlyUnitsSold
 );

 return {
 ...core,
 premium: {
 riskLevel: risk.level,
 verdictText: risk.verdictText,
 recommendation: risk.recommendation,
 scenarios,
 scenarioLabels: SCENARIO_LABELS,
 report: buildReport(input, core, risk.level, risk.recommendation),
 },
 };
}

export function mapMenuProfitLeakResults(output: MenuProfitLeakOutput): ToolResult[] {
 const { premium } = output;

 return [
 {
 id: "actualMargin",
 label: "Actual margin",
 value: output.actualMargin,
 unit: "%",
 tone: premium.riskLevel,
 },
 {
 id: "grossProfitPerItem",
 label: "Gross profit per item",
 value: output.grossProfitPerItem,
 currency: true,
 tone: output.grossProfitPerItem < 0 ? "danger" : "success",
 },
 {
 id: "minimumSafePrice",
 label: "Minimum safe price",
 value: output.minimumSafePrice,
 currency: true,
 tone: output.priceIncreaseNeeded > 0 ? "warning" : "success",
 },
 {
 id: "priceIncreaseNeeded",
 label: "Price increase needed",
 value: Math.max(0, output.priceIncreaseNeeded),
 currency: true,
 tone: output.priceIncreaseNeeded > 0 ? "warning" : "success",
 },
 {
 id: "monthlyProfit",
 label: "Monthly profit",
 value: output.monthlyProfit,
 currency: true,
 tone: output.monthlyProfit < 0 ? "danger" : "neutral",
 },
 {
 id: "monthlyLeak",
 label: "Monthly profit leak",
 value: output.monthlyLeak,
 currency: true,
 tone: output.monthlyLeak > 0 ? "danger" : "success",
 },
 ];
}
