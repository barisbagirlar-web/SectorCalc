// @ts-nocheck
// Auto-generated from rule-of-72-calculator-schema.json
import * as z from 'zod';

export interface Rule_of_72_calculatorInput {
  interestRate: number;
  compoundingFrequency: number;
  ruleConstant: number;
  initialInvestment: number;
}

export const Rule_of_72_calculatorInputSchema = z.object({
  interestRate: z.number().default(8),
  compoundingFrequency: z.number().default(1),
  ruleConstant: z.number().default(72),
  initialInvestment: z.number().default(10000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rule_of_72_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((1 + input.interestRate / 100 / input.compoundingFrequency) ** input.compoundingFrequency - 1); results["effectiveRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveRate"] = 0; }
  try { const v = input.ruleConstant / input.interestRate; results["approxYears"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["approxYears"] = 0; }
  try { const v = input.initialInvestment * (1 + (asFormulaNumber(results["effectiveRate"]))) ** (asFormulaNumber(results["approxYears"])); results["finalApprox"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalApprox"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRule_of_72_calculator(input: Rule_of_72_calculatorInput): Rule_of_72_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["approxYears"]);
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


export interface Rule_of_72_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
