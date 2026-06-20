// Auto-generated from card-value-calculator-schema.json
import * as z from 'zod';

export interface Card_value_calculatorInput {
  spendingPerYear: number;
  rewardsRate: number;
  annualFee: number;
  otherBenefits: number;
  interestRate: number;
  averageBalance: number;
  dataConfidence?: number;
}

export const Card_value_calculatorInputSchema = z.object({
  spendingPerYear: z.number().default(5000),
  rewardsRate: z.number().default(1),
  annualFee: z.number().default(100),
  otherBenefits: z.number().default(0),
  interestRate: z.number().default(0),
  averageBalance: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Card_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spendingPerYear * (input.rewardsRate / 100) + input.otherBenefits; results["grossBenefits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossBenefits"] = Number.NaN; }
  try { const v = input.annualFee + (input.averageBalance * (input.interestRate / 100)); results["totalCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCosts"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossBenefits"])) - (toNumericFormulaValue(results["totalCosts"])); results["netValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netValue"] = Number.NaN; }
  return results;
}


export function calculateCard_value_calculator(input: Card_value_calculatorInput): Card_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netValue"]);
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


export interface Card_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
