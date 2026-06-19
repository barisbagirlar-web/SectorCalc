// Auto-generated from process-economics-npv-calculator-schema.json
import * as z from 'zod';

export interface Process_economics_npv_calculatorInput {
  initialInvestment: number;
  annualCostSavings: number;
  projectLife: number;
  discountRate: number;
  dataConfidence?: number;
}

export const Process_economics_npv_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(100000),
  annualCostSavings: z.number().default(25000),
  projectLife: z.number().default(5),
  discountRate: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Process_economics_npv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualCostSavings * ((1 - (1 + input.discountRate/100) ** (-input.projectLife)) / (input.discountRate/100)) - input.initialInvestment; results["netPresentValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPresentValue"] = 0; }
  try { const v = input.initialInvestment / input.annualCostSavings; results["paybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["paybackPeriod"] = 0; }
  try { const v = (input.annualCostSavings / input.initialInvestment) * 100; results["annualROI"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualROI"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProcess_economics_npv_calculator(input: Process_economics_npv_calculatorInput): Process_economics_npv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netPresentValue"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Process_economics_npv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
