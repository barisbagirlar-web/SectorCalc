// @ts-nocheck
// Auto-generated from cobra-calculator-schema.json
import * as z from 'zod';

export interface Cobra_calculatorInput {
  monthlyPremium: number;
  beneficiaries: number;
  adminFeeRate: number;
  coverageMonths: number;
  employerContributionRate: number;
}

export const Cobra_calculatorInputSchema = z.object({
  monthlyPremium: z.number().default(500),
  beneficiaries: z.number().default(1),
  adminFeeRate: z.number().default(2),
  coverageMonths: z.number().default(18),
  employerContributionRate: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cobra_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.monthlyPremium * input.beneficiaries * input.coverageMonths; results["totalPremium"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPremium"] = 0; }
  try { const v = (asFormulaNumber(results["totalPremium"])) * input.adminFeeRate / 100; results["adminFeeAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adminFeeAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalPremium"])) + (asFormulaNumber(results["adminFeeAmount"])); results["totalCostWithoutContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostWithoutContribution"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostWithoutContribution"])) * input.employerContributionRate / 100; results["employerContributionAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["employerContributionAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostWithoutContribution"])) - (asFormulaNumber(results["employerContributionAmount"])); results["totalEmployeeCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEmployeeCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCobra_calculator(input: Cobra_calculatorInput): Cobra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmployeeCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cobra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
