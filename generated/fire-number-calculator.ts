// Auto-generated from fire-number-calculator-schema.json
import * as z from 'zod';

export interface Fire_number_calculatorInput {
  annualExpenses: number;
  withdrawalRate: number;
  currentSavings: number;
  annualSavings: number;
  expectedReturn: number;
  inflationRate: number;
}

export const Fire_number_calculatorInputSchema = z.object({
  annualExpenses: z.number().default(60000),
  withdrawalRate: z.number().default(4),
  currentSavings: z.number().default(0),
  annualSavings: z.number().default(20000),
  expectedReturn: z.number().default(7),
  inflationRate: z.number().default(2),
});

function evaluateAllFormulas(input: Fire_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualExpenses / (input.withdrawalRate / 100); results["fireNumber"] = Number.isFinite(v) ? v : 0; } catch { results["fireNumber"] = 0; }
  try { const v = (1 + input.expectedReturn / 100) / (1 + input.inflationRate / 100) - 1; results["realReturn"] = Number.isFinite(v) ? v : 0; } catch { results["realReturn"] = 0; }
  try { const v = (results["realReturn"] ?? 0) === 0 ? ((results["fireNumber"] ?? 0) - input.currentSavings) / input.annualSavings : Math.log(((results["fireNumber"] ?? 0) * (results["realReturn"] ?? 0) + input.annualSavings) / (input.currentSavings * (results["realReturn"] ?? 0) + input.annualSavings)) / Math.log(1 + (results["realReturn"] ?? 0)); results["yearsToFire"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToFire"] = 0; }
  return results;
}


export function calculateFire_number_calculator(input: Fire_number_calculatorInput): Fire_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fireNumber"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
