// Auto-generated from actuarial-calculator-schema.json
import * as z from 'zod';

export interface Actuarial_calculatorInput {
  sumAssured: number;
  mortalityRate: number;
  interestRate: number;
  term: number;
  dataConfidence?: number;
}

export const Actuarial_calculatorInputSchema = z.object({
  sumAssured: z.number().default(100000),
  mortalityRate: z.number().default(0.005),
  interestRate: z.number().default(0.03),
  term: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Actuarial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1/(1+input.interestRate); results["discountFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountFactor"] = 0; }
  try { const v = input.sumAssured * input.mortalityRate; results["mortalityRiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mortalityRiskCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateActuarial_calculator(input: Actuarial_calculatorInput): Actuarial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["mortalityRiskCost"]));
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


export interface Actuarial_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
