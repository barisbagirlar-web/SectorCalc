import type { ResultTone, ToolResult } from "@/data/tool-schema";
import { formatCurrency } from "@/lib/format/currency";
import {
 clampMargin,
 priceForMargin,
 RISK_LEVEL_LABELS,
 DEFAULT_PREMIUM_ASSUMPTIONS,
 buildMarginScenarioRows,
 type PremiumCalculatorPayload,
 type ScenarioTableLabels,
} from "@/lib/calculators/premium-types";

export interface CleaningBidOptimizerInput {
 area: number;
 frequencyPerMonth: number;
 hoursPerVisit: number;
 crewSize: number;
 laborHourlyCost: number;
 suppliesCostPerVisit: number;
 travelCostPerVisit: number;
 monthlyOverhead: number;
 targetMargin: number;
 customerBudget: number;
}

export type CleaningBidOptimizerField = keyof CleaningBidOptimizerInput;

export type CleaningBidOptimizerErrors = Partial<
 Record<CleaningBidOptimizerField, string>
>;

export interface CleaningBidOptimizerCore {
 monthlyLaborCost: number;
 monthlySuppliesCost: number;
 monthlyTravelCost: number;
 monthlyDirectCost: number;
 minimumSafeMonthlyBid: number;
 profitAtBudget: number;
 marginAtBudget: number;
 costPerVisit: number;
 safePricePerVisit: number;
 budgetGap: number;
}

export interface CleaningBidOptimizerOutput extends CleaningBidOptimizerCore {
 premium: PremiumCalculatorPayload;
}

const SCENARIO_LABELS: ScenarioTableLabels = {
 subtitle: "Compare minimum safe monthly bids at lower, base and stronger margin targets.",
 metric: "Target margin",
 primary: "Monthly bid",
 secondary: "Per visit",
 profit: "Monthly profit",
};

export function validateCleaningBidOptimizer(
 input: CleaningBidOptimizerInput
): CleaningBidOptimizerErrors {
 const errors: CleaningBidOptimizerErrors = {};

 if (Number.isNaN(input.area) || input.area <= 0) {
 errors.area = "Area must be greater than zero.";
 }

 if (Number.isNaN(input.frequencyPerMonth) || input.frequencyPerMonth < 1) {
 errors.frequencyPerMonth = "Frequency must be at least 1 visit per month.";
 }

 if (Number.isNaN(input.hoursPerVisit) || input.hoursPerVisit <= 0) {
 errors.hoursPerVisit = "Hours per visit must be greater than zero.";
 }

 if (Number.isNaN(input.crewSize) || input.crewSize < 1) {
 errors.crewSize = "Crew size must be at least 1.";
 }

 const costs: CleaningBidOptimizerField[] = [
 "laborHourlyCost",
 "suppliesCostPerVisit",
 "travelCostPerVisit",
 "monthlyOverhead",
 "customerBudget",
 ];

 for (const field of costs) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
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

export function hasCleaningBidValidationErrors(
 errors: CleaningBidOptimizerErrors
): boolean {
 return Object.keys(errors).length > 0;
}

function computeRisk(
 input: CleaningBidOptimizerInput,
 core: CleaningBidOptimizerCore
): { level: ResultTone; verdictText: string; recommendation: string } {
 if (input.customerBudget < core.monthlyDirectCost || core.marginAtBudget < 10) {
 return {
 level: "danger",
 verdictText:
 "High risk: the customer budget does not cover monthly direct cost or leaves critically low margin.",
 recommendation:
 "Do not accept this cleaning contract at the current budget. Labor, travel and supply costs leave insufficient margin.",
 };
 }

 if (
 input.customerBudget < core.minimumSafeMonthlyBid ||
 core.marginAtBudget < input.targetMargin
 ) {
 return {
 level: "warning",
 verdictText:
 "Moderate risk: the budget is below your target margin or minimum safe bid.",
 recommendation:
 "The account may be acceptable only if scope, frequency or route cost is adjusted.",
 };
 }

 return {
 level: "success",
 verdictText:
 "Safe range: the bid appears structurally sound based on your inputs.",
 recommendation:
 "The bid appears safe based on your inputs. Keep route cost and supply usage under control.",
 };
}

function buildReport(
 input: CleaningBidOptimizerInput,
 core: CleaningBidOptimizerCore,
 riskLevel: ResultTone,
 recommendation: string
) {
 return {
 executiveSummary: `For ${input.area.toLocaleString("en-US")} sq ft at ${input.frequencyPerMonth} visits/month, monthly direct cost is ${formatCurrency(core.monthlyDirectCost)}. Minimum safe bid at ${input.targetMargin}% margin is ${formatCurrency(core.minimumSafeMonthlyBid)} (${formatCurrency(core.safePricePerVisit)} per visit). Customer budget: ${formatCurrency(input.customerBudget)}.`,
 keyFindings: [
 `Labor is ${formatCurrency(core.monthlyLaborCost)}/month (${input.crewSize} cleaners × ${input.hoursPerVisit} h × ${input.frequencyPerMonth} visits).`,
 `Margin at customer budget: ${core.marginAtBudget.toFixed(1)}% (${formatCurrency(core.profitAtBudget)} profit).`,
 `Budget gap vs minimum safe: ${core.budgetGap > 0 ? formatCurrency(core.budgetGap) : "none — budget meets minimum safe bid"}.`,
 `Cost per visit: ${formatCurrency(core.costPerVisit)} before margin.`,
 ],
 riskLevelLabel: RISK_LEVEL_LABELS[riskLevel],
 recommendation,
 assumptions: `${DEFAULT_PREMIUM_ASSUMPTIONS} Recurring contracts should also consider route density, equipment replacement and contract length.`,
 };
}

export function calculateCleaningBidOptimizer(
 input: CleaningBidOptimizerInput
): CleaningBidOptimizerOutput | null {
 const errors = validateCleaningBidOptimizer(input);
 if (hasCleaningBidValidationErrors(errors)) return null;

 const monthlyLaborCost =
 input.frequencyPerMonth *
 input.hoursPerVisit *
 input.crewSize *
 input.laborHourlyCost;
 const monthlySuppliesCost =
 input.frequencyPerMonth * input.suppliesCostPerVisit;
 const monthlyTravelCost = input.frequencyPerMonth * input.travelCostPerVisit;
 const monthlyDirectCost =
 monthlyLaborCost +
 monthlySuppliesCost +
 monthlyTravelCost +
 input.monthlyOverhead;

 const minimumSafeMonthlyBid = priceForMargin(
 monthlyDirectCost,
 input.targetMargin
 );
 const profitAtBudget = input.customerBudget - monthlyDirectCost;
 const marginAtBudget =
 input.customerBudget > 0 ? (profitAtBudget / input.customerBudget) * 100 : 0;
 const costPerVisit = monthlyDirectCost / input.frequencyPerMonth;
 const safePricePerVisit = minimumSafeMonthlyBid / input.frequencyPerMonth;
 const budgetGap = minimumSafeMonthlyBid - input.customerBudget;

 const core: CleaningBidOptimizerCore = {
 monthlyLaborCost,
 monthlySuppliesCost,
 monthlyTravelCost,
 monthlyDirectCost,
 minimumSafeMonthlyBid,
 profitAtBudget,
 marginAtBudget,
 costPerVisit,
 safePricePerVisit,
 budgetGap,
 };

 const risk = computeRisk(input, core);

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
 monthlyDirectCost,
 SCENARIO_LABELS,
 { perUnitDivisor: input.frequencyPerMonth }
 );

 const scenariosAdjusted = scenarios.map((row) => ({
 ...row,
 profitValue: row.primaryValue - monthlyDirectCost,
 }));

 return {
 ...core,
 premium: {
 riskLevel: risk.level,
 verdictText: risk.verdictText,
 recommendation: risk.recommendation,
 scenarios: scenariosAdjusted,
 scenarioLabels,
 report: buildReport(input, core, risk.level, risk.recommendation),
 },
 };
}

export function mapCleaningBidResults(
 output: CleaningBidOptimizerOutput
): ToolResult[] {
 const { premium } = output;

 return [
 {
 id: "minimumSafeMonthlyBid",
 label: "Minimum safe monthly bid",
 value: output.minimumSafeMonthlyBid,
 currency: true,
 tone: premium.riskLevel,
 },
 {
 id: "budgetGap",
 label: "Customer budget gap",
 value: Math.max(0, output.budgetGap),
 currency: true,
 tone: output.budgetGap > 0 ? "warning" : "success",
 },
 {
 id: "monthlyDirectCost",
 label: "Monthly direct cost",
 value: output.monthlyDirectCost,
 currency: true,
 tone: "neutral",
 },
 {
 id: "marginAtBudget",
 label: "Margin at customer budget",
 value: output.marginAtBudget,
 unit: "%",
 tone:
 output.marginAtBudget < 10
 ? "danger"
 : output.marginAtBudget < 20
 ? "warning"
 : "success",
 },
 {
 id: "costPerVisit",
 label: "Cost per visit",
 value: output.costPerVisit,
 currency: true,
 tone: "neutral",
 },
 {
 id: "safePricePerVisit",
 label: "Safe price per visit",
 value: output.safePricePerVisit,
 currency: true,
 tone: "neutral",
 },
 ];
}
