// Auto-generated from mortgage-refinance-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_refinance_calculatorInput {
  currentBalance: number;
  currentRate: number;
  currentTermRemaining: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
}

export const Mortgage_refinance_calculatorInputSchema = z.object({
  currentBalance: z.number().default(200000),
  currentRate: z.number().default(5.5),
  currentTermRemaining: z.number().default(240),
  newRate: z.number().default(4),
  newTerm: z.number().default(180),
  closingCosts: z.number().default(3000),
});

function evaluateAllFormulas(input: Mortgage_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentBalance * (input.currentRate/1200 * Math.pow(1 + input.currentRate/1200, input.currentTermRemaining)) / (Math.pow(1 + input.currentRate/1200, input.currentTermRemaining) - 1); results["currentMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["currentMonthlyPayment"] = 0; }
  try { const v = input.currentBalance * (input.newRate/1200 * Math.pow(1 + input.newRate/1200, input.newTerm)) / (Math.pow(1 + input.newRate/1200, input.newTerm) - 1); results["newMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["newMonthlyPayment"] = 0; }
  try { const v = (results["currentMonthlyPayment"] ?? 0) - (results["newMonthlyPayment"] ?? 0); results["monthlySavings"] = Number.isFinite(v) ? v : 0; } catch { results["monthlySavings"] = 0; }
  try { const v = ((results["currentMonthlyPayment"] ?? 0) * input.currentTermRemaining) - ((results["newMonthlyPayment"] ?? 0) * input.newTerm + input.closingCosts); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = input.closingCosts / (results["monthlySavings"] ?? 0); results["breakEvenMonths"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenMonths"] = 0; }
  return results;
}


export function calculateMortgage_refinance_calculator(input: Mortgage_refinance_calculatorInput): Mortgage_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlySavings"] ?? 0;
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


export interface Mortgage_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
