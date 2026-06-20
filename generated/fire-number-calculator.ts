// Auto-generated from fire-number-calculator-schema.json
import * as z from 'zod';

export interface Fire_number_calculatorInput {
  annualExpenses: number;
  withdrawalRate: number;
  currentSavings: number;
  annualSavings: number;
  expectedReturn: number;
  inflationRate: number;
  dataConfidence?: number;
}

export const Fire_number_calculatorInputSchema = z.object({
  annualExpenses: z.number().default(60000),
  withdrawalRate: z.number().default(4),
  currentSavings: z.number().default(0),
  annualSavings: z.number().default(20000),
  expectedReturn: z.number().default(7),
  inflationRate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fire_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualExpenses) * (input.withdrawalRate) * (input.currentSavings) * (input.annualSavings) * (input.expectedReturn) * (input.inflationRate); results["fireNumber"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fireNumber"] = Number.NaN; }
  try { const v = (input.annualExpenses) * (input.withdrawalRate) * (input.currentSavings); results["fireNumber_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fireNumber_aux"] = Number.NaN; }
  return results;
}


export function calculateFire_number_calculator(input: Fire_number_calculatorInput): Fire_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fireNumber"]);
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


export interface Fire_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
