import type { ResultTone, ToolResult } from "@/data/tool-schema";
import { formatCurrency } from "@/lib/core/format/currency";
import {
 clampMargin,
 priceForMargin,
 RISK_LEVEL_LABELS,
 DEFAULT_PREMIUM_ASSUMPTIONS,
 buildMarginScenarioRows,
 type PremiumCalculatorPayload,
 type ScenarioTableLabels,
} from "@/lib/features/calculators/premium-types";

export interface CncQuoteAnalyzerInput {
 quantity: number;
 materialCostPerPart: number;
 setupMinutes: number;
 cycleMinutesPerPart: number;
 machineHourlyCost: number;
 operatorHourlyCost: number;
 toolingCost: number;
 scrapRate: number;
 overheadCost: number;
 targetMargin: number;
}

export type CncQuoteAnalyzerField = keyof CncQuoteAnalyzerInput;

export type CncQuoteAnalyzerErrors = Partial<Record<CncQuoteAnalyzerField, string>>;

export interface CncQuoteAnalyzerCore {
 setupHours: number;
 cycleHoursTotal: number;
 productiveMachineHours: number;
 machineCost: number;
 operatorCost: number;
 materialCost: number;
 directCost: number;
 minimumSafeQuote: number;
 unitSafePrice: number;
 breakEvenQuote: number;
 grossProfit: number;
 setupCostShare: number;
 scrapCostImpact: number;
}

export type CncQuotePremiumPayload = PremiumCalculatorPayload;

export interface CncQuoteAnalyzerOutput extends CncQuoteAnalyzerCore {
 premium: PremiumCalculatorPayload;
}

const CNC_SCENARIO_LABELS: ScenarioTableLabels = {
 subtitle: "Compare minimum safe quotes at lower, base and stronger margin targets.",
 metric: "Target margin",
 primary: "Quote",
 secondary: "Unit price",
 profit: "Gross profit",
};

export function validateCncQuoteAnalyzer(
 input: CncQuoteAnalyzerInput
): CncQuoteAnalyzerErrors {
 const errors: CncQuoteAnalyzerErrors = {};

 if (Number.isNaN(input.quantity) || input.quantity <= 0) {
 errors.quantity = "Quantity must be greater than zero.";
 }

 const nonNegativeFields: CncQuoteAnalyzerField[] = [
 "materialCostPerPart",
 "setupMinutes",
 "machineHourlyCost",
 "operatorHourlyCost",
 "toolingCost",
 "overheadCost",
 ];

 for (const field of nonNegativeFields) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 if (Number.isNaN(input.cycleMinutesPerPart) || input.cycleMinutesPerPart <= 0) {
 errors.cycleMinutesPerPart = "Cycle time must be greater than zero.";
 }

 if (
 Number.isNaN(input.scrapRate) ||
 input.scrapRate < 0 ||
 input.scrapRate > 100
 ) {
 errors.scrapRate = "Scrap rate must be between 0% and 100%.";
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

export function hasCncValidationErrors(errors: CncQuoteAnalyzerErrors): boolean {
 return Object.keys(errors).length > 0;
}

function computeRisk(
 input: CncQuoteAnalyzerInput,
 setupCostShare: number
): { level: ResultTone; verdictText: string; recommendation: string } {
 if (setupCostShare > 45 || input.targetMargin < 15 || input.quantity <= 5) {
 return {
 level: "danger",
 verdictText:
 "High risk: this job may be underpriced if setup, scrap or tooling are not fully included.",
 recommendation:
 "Do not send this quote until setup, scrap and tooling are reviewed. Consider increasing the minimum order quantity or raising the quote.",
 };
 }

 if (setupCostShare > 25 || input.scrapRate > 8 || input.targetMargin < 25) {
 return {
 level: "warning",
 verdictText:
 "Moderate risk: review setup cost, scrap allowance and margin before sending the quote.",
 recommendation:
 "The job may be acceptable, but the quote should include a margin buffer for setup and scrap variation.",
 };
 }

 return {
 level: "success",
 verdictText:
 "Safe range: the quote appears structurally sound based on your inputs.",
 recommendation:
 "The current quote structure appears acceptable. Keep the same logic for similar jobs and re-run the analysis when quantity or material cost changes.",
 };
}

function buildReport(
 input: CncQuoteAnalyzerInput,
 core: CncQuoteAnalyzerCore,
 risk: ReturnType<typeof computeRisk>
) {
 return {
 executiveSummary: `For a batch of ${input.quantity} parts at ${input.targetMargin}% target margin, the minimum safe quote is ${formatCurrency(core.minimumSafeQuote)} (${formatCurrency(core.unitSafePrice)} per unit). Direct cost before margin is ${formatCurrency(core.directCost)} with ${formatCurrency(core.grossProfit)} gross profit at the target margin.`,
 keyFindings: [
 `Productive machine time totals ${core.productiveMachineHours.toFixed(1)} hours (setup ${core.setupHours.toFixed(1)} h + cycle ${core.cycleHoursTotal.toFixed(1)} h).`,
 `Setup cost represents ${core.setupCostShare.toFixed(1)}% of direct cost - small batches amplify setup exposure.`,
 `Scrap at ${input.scrapRate}% adds an estimated ${formatCurrency(core.scrapCostImpact)} material impact on this job.`,
 `Break-even quote (no margin) is ${formatCurrency(core.breakEvenQuote)}; target margin requires ${formatCurrency(core.minimumSafeQuote)}.`,
 ],
 riskLevelLabel: RISK_LEVEL_LABELS[risk.level],
 recommendation: risk.recommendation,
 assumptions: `${DEFAULT_PREMIUM_ASSUMPTIONS} Shop quotes should be validated against setup time, tooling life and material price volatility.`,
 };
}

export function calculateCncQuoteAnalyzer(
 input: CncQuoteAnalyzerInput
): CncQuoteAnalyzerOutput | null {
 const errors = validateCncQuoteAnalyzer(input);
 if (hasCncValidationErrors(errors)) return null;

 const setupHours = input.setupMinutes / 60;
 const cycleHoursTotal = (input.cycleMinutesPerPart * input.quantity) / 60;
 const productiveMachineHours = setupHours + cycleHoursTotal;

 const machineCost = productiveMachineHours * input.machineHourlyCost;
 const operatorCost = productiveMachineHours * input.operatorHourlyCost;

 const scrapMultiplier = 1 + input.scrapRate / 100;
 const materialCost = input.materialCostPerPart * input.quantity * scrapMultiplier;

 const directCost =
 machineCost + operatorCost + materialCost + input.toolingCost + input.overheadCost;

 const minimumSafeQuote = priceForMargin(directCost, input.targetMargin);
 const unitSafePrice = minimumSafeQuote / input.quantity;
 const breakEvenQuote = directCost;
 const grossProfit = minimumSafeQuote - directCost;

 const setupLaborCost = setupHours * (input.machineHourlyCost + input.operatorHourlyCost);
 const setupCostShare =
 directCost > 0 ? (setupLaborCost / directCost) * 100 : 0;

 const scrapCostImpact =
 input.materialCostPerPart * input.quantity * (input.scrapRate / 100);

 const core: CncQuoteAnalyzerCore = {
 setupHours,
 cycleHoursTotal,
 productiveMachineHours,
 machineCost,
 operatorCost,
 materialCost,
 directCost,
 minimumSafeQuote,
 unitSafePrice,
 breakEvenQuote,
 grossProfit,
 setupCostShare,
 scrapCostImpact,
 };

 const risk = computeRisk(input, setupCostShare);
 const { scenarios, scenarioLabels } = buildMarginScenarioRows(
 [
 {
 id: "low",
 label: "Low margin scenario",
 margin: clampMargin(input.targetMargin - 10),
 },
 { id: "base", label: "Base scenario", margin: input.targetMargin },
 {
 id: "strong",
 label: "Strong margin scenario",
 margin: clampMargin(input.targetMargin + 10),
 },
 ],
 directCost,
 CNC_SCENARIO_LABELS,
 { perUnitDivisor: input.quantity }
 );

 return {
 ...core,
 premium: {
 riskLevel: risk.level,
 verdictText: risk.verdictText,
 recommendation: risk.recommendation,
 scenarios,
 scenarioLabels,
 report: buildReport(input, core, risk),
 },
 };
}

function setupShareTone(share: number): ResultTone {
 if (share > 45) return "danger";
 if (share > 25) return "warning";
 return "neutral";
}

export function mapCncQuoteResults(output: CncQuoteAnalyzerOutput): ToolResult[] {
 const { premium } = output;

 return [
 {
 id: "minimumSafeQuote",
 label: "Minimum safe quote",
 value: output.minimumSafeQuote,
 currency: true,
 tone: premium.riskLevel,
 },
 {
 id: "unitSafePrice",
 label: "Safe unit price",
 value: output.unitSafePrice,
 currency: true,
 tone: "neutral",
 },
 {
 id: "breakEvenQuote",
 label: "Break-even quote",
 value: output.breakEvenQuote,
 currency: true,
 tone: "neutral",
 },
 {
 id: "grossProfit",
 label: "Gross profit at target margin",
 value: output.grossProfit,
 currency: true,
 tone: premium.riskLevel === "danger" ? "warning" : "success",
 },
 {
 id: "setupCostShare",
 label: "Setup cost share",
 value: output.setupCostShare,
 unit: "%",
 tone: setupShareTone(output.setupCostShare),
 },
 {
 id: "scrapCostImpact",
 label: "Scrap cost impact",
 value: output.scrapCostImpact,
 currency: true,
 tone: output.scrapCostImpact > 500 ? "warning" : "neutral",
 },
 ];
}
