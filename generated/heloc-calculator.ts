// Auto-generated from heloc-calculator-schema.json
import * as z from 'zod';

export interface Heloc_calculatorInput {
  homeValue: number;
  mortgageBalance: number;
  ltvLimit: number;
  interestRate: number;
  drawAmount: number;
  loanTerm: number;
}

export const Heloc_calculatorInputSchema = z.object({
  homeValue: z.number().default(300000),
  mortgageBalance: z.number().default(200000),
  ltvLimit: z.number().default(80),
  interestRate: z.number().default(5),
  drawAmount: z.number().default(50000),
  loanTerm: z.number().default(10),
});

function evaluateAllFormulas(input: Heloc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.homeValue * (input.ltvLimit / 100) - input.mortgageBalance; results["maxHeloc"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeloc"] = 0; }
  try { const v = input.homeValue - input.mortgageBalance; results["availableEquity"] = Number.isFinite(v) ? v : 0; } catch { results["availableEquity"] = 0; }
  try { const v = (input.drawAmount * (input.interestRate / 100 / 12) * Math.pow(1 + input.interestRate / 100 / 12, input.loanTerm * 12)) / (Math.pow(1 + input.interestRate / 100 / 12, input.loanTerm * 12) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTerm * 12 - input.drawAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateHeloc_calculator(input: Heloc_calculatorInput): Heloc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxHeloc"] ?? 0;
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


export interface Heloc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
