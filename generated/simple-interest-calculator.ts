// Auto-generated from simple-interest-calculator-schema.json
import * as z from 'zod';

export interface Simple_interest_calculatorInput {
  principal: number;
  rate: number;
  startYear: number;
  endYear: number;
}

export const Simple_interest_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  rate: z.number().default(5),
  startYear: z.number().default(2025),
  endYear: z.number().default(2030),
});

function evaluateAllFormulas(input: Simple_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endYear - input.startYear; results["timeInYears"] = Number.isFinite(v) ? v : 0; } catch { results["timeInYears"] = 0; }
  try { const v = input.principal * (input.rate / 100) * (results["timeInYears"] ?? 0); results["simpleInterest"] = Number.isFinite(v) ? v : 0; } catch { results["simpleInterest"] = 0; }
  try { const v = input.principal + (results["simpleInterest"] ?? 0); results["totalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalAmount"] = 0; }
  return results;
}


export function calculateSimple_interest_calculator(input: Simple_interest_calculatorInput): Simple_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["simpleInterest"] ?? 0;
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


export interface Simple_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
