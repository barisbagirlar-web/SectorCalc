// Auto-generated from umbrella-insurance-calculator-schema.json
import * as z from 'zod';

export interface Umbrella_insurance_calculatorInput {
  totalAssets: number;
  totalLiabilities: number;
  underlyingCoverage: number;
  riskFactor: number;
  dataConfidence?: number;
}

export const Umbrella_insurance_calculatorInputSchema = z.object({
  totalAssets: z.number().default(500000),
  totalLiabilities: z.number().default(200000),
  underlyingCoverage: z.number().default(300000),
  riskFactor: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Umbrella_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalAssets - input.totalLiabilities; results["netWorth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWorth"] = 0; }
  try { const v = (asFormulaNumber(results["netWorth"])) * (input.riskFactor / 100); results["riskAdjustedNetWorth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskAdjustedNetWorth"] = 0; }
  try { const v = (asFormulaNumber(results["riskAdjustedNetWorth"])) - input.underlyingCoverage; results["coverageGap"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coverageGap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUmbrella_insurance_calculator(input: Umbrella_insurance_calculatorInput): Umbrella_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["coverageGap"]));
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


export interface Umbrella_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
