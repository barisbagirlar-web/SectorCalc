// Auto-generated from rule-of-72-calculator-schema.json
import * as z from 'zod';

export interface Rule_of_72_calculatorInput {
  interestRate: number;
  compoundingFrequency: number;
  ruleConstant: number;
  initialInvestment: number;
  dataConfidence?: number;
}

export const Rule_of_72_calculatorInputSchema = z.object({
  interestRate: z.number().default(8),
  compoundingFrequency: z.number().default(1),
  ruleConstant: z.number().default(72),
  initialInvestment: z.number().default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rule_of_72_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((1 + input.interestRate / 100 / input.compoundingFrequency) ** input.compoundingFrequency - 1); results["effectiveRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveRate"] = 0; }
  try { const v = input.ruleConstant / input.interestRate; results["approxYears"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["approxYears"] = 0; }
  try { const v = input.initialInvestment * (1 + (asFormulaNumber(results["effectiveRate"]))) ** (asFormulaNumber(results["approxYears"])); results["finalApprox"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalApprox"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRule_of_72_calculator(input: Rule_of_72_calculatorInput): Rule_of_72_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["approxYears"]);
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


export interface Rule_of_72_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
