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

export interface ChangeOrderAnalyzerInput {
 originalContractValue: number;
 originalEstimatedCost: number;
 extraLaborHours: number;
 laborHourlyRate: number;
 extraMaterialCost: number;
 extraEquipmentCost: number;
 delayDays: number;
 dailyOverheadCost: number;
 targetChangeMargin: number;
 customerOfferedPrice: number;
}

export type ChangeOrderAnalyzerField = keyof ChangeOrderAnalyzerInput;

export type ChangeOrderAnalyzerErrors = Partial<
 Record<ChangeOrderAnalyzerField, string>
>;

export interface ChangeOrderAnalyzerCore {
 originalExpectedProfit: number;
 originalExpectedMargin: number;
 extraLaborCost: number;
 delayCost: number;
 extraDirectCost: number;
 minimumSafeChangePrice: number;
 changeProfitAtOfferedPrice: number;
 changeMarginAtOfferedPrice: number;
 shortfall: number;
 newProjectValue: number;
 newProjectCost: number;
 newProjectProfit: number;
 newProjectMargin: number;
 marginDelta: number;
}

export interface ChangeOrderAnalyzerOutput extends ChangeOrderAnalyzerCore {
 premium: PremiumCalculatorPayload;
}

const SCENARIO_LABELS: ScenarioTableLabels = {
 subtitle: "Compare minimum safe change prices at lower, base and stronger margin targets.",
 metric: "Target margin",
 primary: "Min. change price",
 secondary: "Change profit",
 profit: "Gross profit",
};

export function validateChangeOrderAnalyzer(
 input: ChangeOrderAnalyzerInput
): ChangeOrderAnalyzerErrors {
 const errors: ChangeOrderAnalyzerErrors = {};

 const nonNegative: ChangeOrderAnalyzerField[] = [
 "originalContractValue",
 "originalEstimatedCost",
 "extraLaborHours",
 "laborHourlyRate",
 "extraMaterialCost",
 "extraEquipmentCost",
 "delayDays",
 "dailyOverheadCost",
 "customerOfferedPrice",
 ];

 for (const field of nonNegative) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 if (
 Number.isNaN(input.targetChangeMargin) ||
 input.targetChangeMargin < 1 ||
 input.targetChangeMargin > 80
 ) {
 errors.targetChangeMargin = "Target margin must be between 1% and 80%.";
 }

 return errors;
}

export function hasChangeOrderValidationErrors(
 errors: ChangeOrderAnalyzerErrors
): boolean {
 return Object.keys(errors).length > 0;
}

function computeRisk(
 input: ChangeOrderAnalyzerInput,
 core: ChangeOrderAnalyzerCore
): { level: ResultTone; verdictText: string; recommendation: string } {
 if (
 input.customerOfferedPrice < core.extraDirectCost ||
 core.shortfall > core.minimumSafeChangePrice * 0.15 ||
 core.newProjectMargin < 10
 ) {
 return {
 level: "danger",
 verdictText:
 "High risk: the offered change price may not cover cost or may damage overall project margin.",
 recommendation:
 "Do not approve this change at the offered price. The change either fails to cover cost or materially damages the project margin.",
 };
 }

 if (
 input.customerOfferedPrice < core.minimumSafeChangePrice ||
 core.marginDelta < -3
 ) {
 return {
 level: "warning",
 verdictText:
 "Moderate risk: the change may be underpriced relative to your margin target.",
 recommendation:
 "Renegotiate the change price or reduce scope. The offered price may be acceptable only with a lower margin buffer.",
 };
 }

 return {
 level: "success",
 verdictText:
 "Safe range: the change order appears structurally sound based on your inputs.",
 recommendation:
 "The change order appears structurally safe based on your inputs. Confirm scope, timing and exclusions before sending.",
 };
}

function buildReport(
 input: ChangeOrderAnalyzerInput,
 core: ChangeOrderAnalyzerCore,
 riskLevel: ResultTone,
 recommendation: string
) {
 return {
 executiveSummary: `Original project margin is ${core.originalExpectedMargin.toFixed(1)}%. This change adds ${formatCurrency(core.extraDirectCost)} in direct cost; minimum safe change price at ${input.targetChangeMargin}% margin is ${formatCurrency(core.minimumSafeChangePrice)}. Customer offered ${formatCurrency(input.customerOfferedPrice)} (${core.shortfall > 0 ? `${formatCurrency(core.shortfall)} below minimum safe` : "at or above minimum safe"}).`,
 keyFindings: [
 `Extra direct cost: ${formatCurrency(core.extraDirectCost)} (labor ${formatCurrency(core.extraLaborCost)}, delay ${formatCurrency(core.delayCost)}).`,
 `Change margin at offered price: ${core.changeMarginAtOfferedPrice.toFixed(1)}%.`,
 `New blended project margin: ${core.newProjectMargin.toFixed(1)}% (${core.marginDelta >= 0 ? "+" : ""}${core.marginDelta.toFixed(1)} pts vs original).`,
 `Delay adds ${formatCurrency(core.delayCost)} across ${input.delayDays} day(s) at ${formatCurrency(input.dailyOverheadCost)}/day overhead.`,
 ],
 riskLevelLabel: RISK_LEVEL_LABELS[riskLevel],
 recommendation,
 assumptions: `${DEFAULT_PREMIUM_ASSUMPTIONS} Change-order pricing should be confirmed against contract terms and site conditions.`,
 };
}

export function calculateChangeOrderAnalyzer(
 input: ChangeOrderAnalyzerInput
): ChangeOrderAnalyzerOutput | null {
 const errors = validateChangeOrderAnalyzer(input);
 if (hasChangeOrderValidationErrors(errors)) return null;

 const originalExpectedProfit =
 input.originalContractValue - input.originalEstimatedCost;
 const originalExpectedMargin =
 input.originalContractValue > 0
 ? (originalExpectedProfit / input.originalContractValue) * 100
 : 0;

 const extraLaborCost = input.extraLaborHours * input.laborHourlyRate;
 const delayCost = input.delayDays * input.dailyOverheadCost;
 const extraDirectCost =
 extraLaborCost +
 input.extraMaterialCost +
 input.extraEquipmentCost +
 delayCost;

 const minimumSafeChangePrice = priceForMargin(
 extraDirectCost,
 input.targetChangeMargin
 );
 const changeProfitAtOfferedPrice =
 input.customerOfferedPrice - extraDirectCost;
 const changeMarginAtOfferedPrice =
 input.customerOfferedPrice > 0
 ? (changeProfitAtOfferedPrice / input.customerOfferedPrice) * 100
 : 0;
 const shortfall = minimumSafeChangePrice - input.customerOfferedPrice;

 const newProjectValue = input.originalContractValue + input.customerOfferedPrice;
 const newProjectCost = input.originalEstimatedCost + extraDirectCost;
 const newProjectProfit = newProjectValue - newProjectCost;
 const newProjectMargin =
 newProjectValue > 0 ? (newProjectProfit / newProjectValue) * 100 : 0;
 const marginDelta = newProjectMargin - originalExpectedMargin;

 const core: ChangeOrderAnalyzerCore = {
 originalExpectedProfit,
 originalExpectedMargin,
 extraLaborCost,
 delayCost,
 extraDirectCost,
 minimumSafeChangePrice,
 changeProfitAtOfferedPrice,
 changeMarginAtOfferedPrice,
 shortfall,
 newProjectValue,
 newProjectCost,
 newProjectProfit,
 newProjectMargin,
 marginDelta,
 };

 const risk = computeRisk(input, core);

 const marginScenarios = [
 {
 id: "low",
 label: "Low margin scenario",
 margin: clampMargin(input.targetChangeMargin - 10),
 },
 {
 id: "base",
 label: "Base scenario",
 margin: input.targetChangeMargin,
 },
 {
 id: "strong",
 label: "Strong margin scenario",
 margin: clampMargin(input.targetChangeMargin + 10),
 },
 ];

 const { scenarios, scenarioLabels } = buildMarginScenarioRows(
 marginScenarios,
 extraDirectCost,
 SCENARIO_LABELS
 );

 const scenariosAdjusted = scenarios.map((row) => ({
 ...row,
 secondaryValue: row.primaryValue - extraDirectCost,
 secondaryFormat: "currency" as const,
 }));

 return {
 ...core,
 premium: {
 riskLevel: risk.level,
 verdictText: risk.verdictText,
 recommendation: risk.recommendation,
 scenarios: scenariosAdjusted,
 scenarioLabels: {
 ...scenarioLabels,
 secondary: "Change profit",
 },
 report: buildReport(input, core, risk.level, risk.recommendation),
 },
 };
}

export function mapChangeOrderResults(
 output: ChangeOrderAnalyzerOutput
): ToolResult[] {
 const { premium } = output;

 return [
 {
 id: "minimumSafeChangePrice",
 label: "Minimum safe change price",
 value: output.minimumSafeChangePrice,
 currency: true,
 tone: premium.riskLevel,
 },
 {
 id: "shortfall",
 label: "Customer offered price gap",
 value: Math.max(0, output.shortfall),
 currency: true,
 tone: output.shortfall > 0 ? "warning" : "success",
 },
 {
 id: "extraDirectCost",
 label: "Extra direct cost",
 value: output.extraDirectCost,
 currency: true,
 tone: "neutral",
 },
 {
 id: "newProjectMargin",
 label: "New project margin",
 value: output.newProjectMargin,
 unit: "%",
 tone: output.newProjectMargin < 10 ? "danger" : output.marginDelta < -3 ? "warning" : "success",
 },
 {
 id: "marginDelta",
 label: "Margin delta",
 value: output.marginDelta,
 unit: "%",
 tone: output.marginDelta < -3 ? "danger" : output.marginDelta < 0 ? "warning" : "success",
 },
 {
 id: "delayCost",
 label: "Delay cost",
 value: output.delayCost,
 currency: true,
 tone: "neutral",
 },
 ];
}
