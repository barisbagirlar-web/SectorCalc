// Auto-generated from cobra-calculator-schema.json
import * as z from 'zod';

export interface Cobra_calculatorInput {
  monthlyPremium: number;
  beneficiaries: number;
  adminFeeRate: number;
  coverageMonths: number;
  employerContributionRate: number;
  dataConfidence?: number;
}

export const Cobra_calculatorInputSchema = z.object({
  monthlyPremium: z.number().default(500),
  beneficiaries: z.number().default(1),
  adminFeeRate: z.number().default(2),
  coverageMonths: z.number().default(18),
  employerContributionRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cobra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyPremium * input.beneficiaries * input.coverageMonths; results["totalPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPremium"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPremium"])) * input.adminFeeRate / 100; results["adminFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adminFeeAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPremium"])) + (toNumericFormulaValue(results["adminFeeAmount"])); results["totalCostWithoutContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostWithoutContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostWithoutContribution"])) * input.employerContributionRate / 100; results["employerContributionAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["employerContributionAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostWithoutContribution"])) - (toNumericFormulaValue(results["employerContributionAmount"])); results["totalEmployeeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEmployeeCost"] = Number.NaN; }
  return results;
}


export function calculateCobra_calculator(input: Cobra_calculatorInput): Cobra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmployeeCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
