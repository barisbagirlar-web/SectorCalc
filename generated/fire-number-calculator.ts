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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fire_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualExpenses / (input.withdrawalRate / 100); results["fireNumber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fireNumber"] = 0; }
  try { const v = input.annualExpenses / (input.withdrawalRate / 100); results["fireNumber_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fireNumber_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFire_number_calculator(input: Fire_number_calculatorInput): Fire_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["fireNumber"]));
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


export interface Fire_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
