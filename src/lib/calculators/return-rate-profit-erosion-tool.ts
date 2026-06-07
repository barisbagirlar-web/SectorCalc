import type { ResultTone, ToolResult } from "@/data/tool-schema";
import { formatCurrency } from "@/lib/format/currency";
import {
 RISK_LEVEL_LABELS,
 DEFAULT_PREMIUM_ASSUMPTIONS,
 priceForMargin,
 type PremiumCalculatorPayload,
 type PremiumScenarioRow,
 type ScenarioTableLabels,
} from "@/lib/calculators/premium-types";

export interface ReturnRateErosionInput {
 sellingPrice: number;
 productCost: number;
 shippingCost: number;
 platformFeeRate: number;
 paymentFeeRate: number;
 returnRate: number;
 returnHandlingCost: number;
 adCostPerOrder: number;
 targetMargin: number;
}

export type ReturnRateErosionField = keyof ReturnRateErosionInput;

export type ReturnRateErosionErrors = Partial<Record<ReturnRateErosionField, string>>;

export interface ReturnRateErosionCore {
 platformFee: number;
 paymentFee: number;
 expectedReturnLoss: number;
 totalCost: number;
 netProfit: number;
 netMargin: number;
 breakEvenAdCost: number;
 requiredPriceForTargetMargin: number;
 priceGap: number;
 returnImpact: number;
}

export interface ReturnRateErosionOutput extends ReturnRateErosionCore {
 premium: PremiumCalculatorPayload;
}

const SCENARIO_LABELS: ScenarioTableLabels = {
 subtitle: "Compare outcomes at lower, base and higher return rate assumptions.",
 metric: "Return rate",
 primary: "Required price",
 secondary: "Net margin",
 profit: "Net profit",
};

function clampReturnRate(rate: number): number {
 return Math.min(100, Math.max(0, rate));
}

function computeAtReturnRate(
 input: ReturnRateErosionInput,
 returnRate: number
) {
 const platformFee = input.sellingPrice * (input.platformFeeRate / 100);
 const paymentFee = input.sellingPrice * (input.paymentFeeRate / 100);
 const expectedReturnLoss =
 (input.sellingPrice + input.returnHandlingCost) * (returnRate / 100);
 const totalCost =
 input.productCost +
 input.shippingCost +
 platformFee +
 paymentFee +
 expectedReturnLoss +
 input.adCostPerOrder;
 const netProfit = input.sellingPrice - totalCost;
 const netMargin =
 input.sellingPrice > 0 ? (netProfit / input.sellingPrice) * 100 : 0;
 const requiredPriceForTargetMargin = priceForMargin(
 totalCost,
 input.targetMargin
 );

 return {
 platformFee,
 paymentFee,
 expectedReturnLoss,
 totalCost,
 netProfit,
 netMargin,
 requiredPriceForTargetMargin,
 };
}

export function validateReturnRateErosion(
 input: ReturnRateErosionInput
): ReturnRateErosionErrors {
 const errors: ReturnRateErosionErrors = {};

 const nonNegative: ReturnRateErosionField[] = [
 "sellingPrice",
 "productCost",
 "shippingCost",
 "returnHandlingCost",
 "adCostPerOrder",
 ];

 for (const field of nonNegative) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 const rates: ReturnRateErosionField[] = [
 "platformFeeRate",
 "paymentFeeRate",
 "returnRate",
 ];

 for (const field of rates) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0 || value > 100) {
 errors[field] = "Percentage must be between 0% and 100%.";
 }
 }

 if (
 Number.isNaN(input.targetMargin) ||
 input.targetMargin < 1 ||
 input.targetMargin > 80
 ) {
 errors.targetMargin = "Target margin must be between 1% and 80%.";
 }

 return errors;
}

export function hasReturnRateErosionValidationErrors(
 errors: ReturnRateErosionErrors
): boolean {
 return Object.keys(errors).length > 0;
}

function computeRisk(
 input: ReturnRateErosionInput,
 core: ReturnRateErosionCore
): { level: ResultTone; verdictText: string; recommendation: string } {
 if (core.netProfit < 0 || core.netMargin < 5 || core.breakEvenAdCost < 0) {
 return {
 level: "danger",
 verdictText:
 "High risk: returns and ad cost may make this product structurally unprofitable.",
 recommendation:
 "This product may be structurally unprofitable after returns and ad cost. Reduce return rate, raise price or stop scaling paid ads.",
 };
 }

 if (core.netMargin < input.targetMargin || input.returnRate > 15) {
 return {
 level: "warning",
 verdictText:
 "Moderate risk: margin is below target or return rate is elevated.",
 recommendation:
 "The product is profitable but below the target margin. Monitor returns and advertising cost before increasing budget.",
 };
 }

 return {
 level: "success",
 verdictText:
 "Safe range: the product appears healthy based on your visible cost inputs.",
 recommendation:
 "The product appears healthy based on your inputs. Re-run when return rate or ad cost changes.",
 };
}

function buildReturnScenarios(
 input: ReturnRateErosionInput
): PremiumScenarioRow[] {
 const rates = [
 {
 id: "low",
 label: "Lower return rate",
 rate: clampReturnRate(input.returnRate - 5),
 },
 { id: "base", label: "Base return rate", rate: input.returnRate },
 {
 id: "high",
 label: "Higher return rate",
 rate: clampReturnRate(input.returnRate + 5),
 },
 ];

 return rates.map(({ id, label, rate }) => {
 const calc = computeAtReturnRate(input, rate);
 return {
 id,
 label,
 metricDisplay: `${rate}%`,
 primaryValue: calc.requiredPriceForTargetMargin,
 secondaryValue: calc.netMargin,
 secondaryFormat: "percent" as const,
 profitValue: calc.netProfit,
 };
 });
}

function buildReport(
 input: ReturnRateErosionInput,
 core: ReturnRateErosionCore,
 riskLevel: ResultTone,
 recommendation: string
) {
 return {
 executiveSummary: `At ${formatCurrency(input.sellingPrice)} selling price and ${input.returnRate}% return rate, net margin is ${core.netMargin.toFixed(1)}% (${formatCurrency(core.netProfit)} per order). Return impact is ${formatCurrency(core.returnImpact)}. Required price for ${input.targetMargin}% margin: ${formatCurrency(core.requiredPriceForTargetMargin)}.`,
 keyFindings: [
 `Total visible cost per order: ${formatCurrency(core.totalCost)} including ${formatCurrency(input.adCostPerOrder)} ad spend.`,
 `Break-even ad cost (before loss): ${formatCurrency(core.breakEvenAdCost)} per order.`,
 `Price gap vs target margin price: ${core.priceGap > 0 ? formatCurrency(core.priceGap) : "none at current price"}.`,
 `Platform + payment fees: ${formatCurrency(core.platformFee + core.paymentFee)} combined on each order.`,
 ],
 riskLevelLabel: RISK_LEVEL_LABELS[riskLevel],
 recommendation,
 assumptions: `${DEFAULT_PREMIUM_ASSUMPTIONS} E-commerce decisions should also consider cash cycle, inventory risk and blended catalog ad efficiency.`,
 };
}

export function calculateReturnRateErosion(
 input: ReturnRateErosionInput
): ReturnRateErosionOutput | null {
 const errors = validateReturnRateErosion(input);
 if (hasReturnRateErosionValidationErrors(errors)) return null;

 const base = computeAtReturnRate(input, input.returnRate);
 const breakEvenAdCost =
 input.sellingPrice -
 (input.productCost +
 input.shippingCost +
 base.platformFee +
 base.paymentFee +
 base.expectedReturnLoss);
 const priceGap = base.requiredPriceForTargetMargin - input.sellingPrice;

 const core: ReturnRateErosionCore = {
 platformFee: base.platformFee,
 paymentFee: base.paymentFee,
 expectedReturnLoss: base.expectedReturnLoss,
 totalCost: base.totalCost,
 netProfit: base.netProfit,
 netMargin: base.netMargin,
 breakEvenAdCost,
 requiredPriceForTargetMargin: base.requiredPriceForTargetMargin,
 priceGap,
 returnImpact: base.expectedReturnLoss,
 };

 const risk = computeRisk(input, core);
 const scenarios = buildReturnScenarios(input);

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

export function mapReturnRateErosionResults(
 output: ReturnRateErosionOutput
): ToolResult[] {
 const { premium } = output;

 return [
 {
 id: "netMargin",
 label: "Net margin",
 value: output.netMargin,
 unit: "%",
 tone: premium.riskLevel,
 },
 {
 id: "netProfit",
 label: "Net profit per order",
 value: output.netProfit,
 currency: true,
 tone: output.netProfit < 0 ? "danger" : "success",
 },
 {
 id: "returnImpact",
 label: "Return impact",
 value: output.returnImpact,
 currency: true,
 tone: output.returnImpact > 10 ? "warning" : "neutral",
 },
 {
 id: "breakEvenAdCost",
 label: "Break-even ad cost",
 value: Math.max(0, output.breakEvenAdCost),
 currency: true,
 tone: output.breakEvenAdCost < 0 ? "danger" : "neutral",
 },
 {
 id: "requiredPriceForTargetMargin",
 label: "Required price for target margin",
 value: output.requiredPriceForTargetMargin,
 currency: true,
 tone: output.priceGap > 0 ? "warning" : "success",
 },
 {
 id: "priceGap",
 label: "Price gap",
 value: Math.max(0, output.priceGap),
 currency: true,
 tone: output.priceGap > 0 ? "warning" : "success",
 },
 ];
}
