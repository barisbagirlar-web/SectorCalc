// Auto-generated from visa-funds-calculator-schema.json
import * as z from 'zod';

export interface Visa_funds_calculatorInput {
  dailyExpenseEUR: number;
  numberOfDays: number;
  exchangeRate: number;
  bufferPercent: number;
  applicationFee: number;
}

export const Visa_funds_calculatorInputSchema = z.object({
  dailyExpenseEUR: z.number().default(100),
  numberOfDays: z.number().default(7),
  exchangeRate: z.number().default(1.1),
  bufferPercent: z.number().default(20),
  applicationFee: z.number().default(800),
});

function evaluateAllFormulas(input: Visa_funds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyExpenseEUR * input.numberOfDays; results["baseRequiredEUR"] = Number.isFinite(v) ? v : 0; } catch { results["baseRequiredEUR"] = 0; }
  try { const v = (results["baseRequiredEUR"] ?? 0) * (input.bufferPercent / 100); results["bufferEUR"] = Number.isFinite(v) ? v : 0; } catch { results["bufferEUR"] = 0; }
  try { const v = (results["baseRequiredEUR"] ?? 0) + (results["bufferEUR"] ?? 0); results["totalRequiredEUR"] = Number.isFinite(v) ? v : 0; } catch { results["totalRequiredEUR"] = 0; }
  try { const v = (results["totalRequiredEUR"] ?? 0) * input.exchangeRate; results["totalRequiredLocal"] = Number.isFinite(v) ? v : 0; } catch { results["totalRequiredLocal"] = 0; }
  try { const v = (results["totalRequiredLocal"] ?? 0) + input.applicationFee; results["totalCostLocal"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostLocal"] = 0; }
  return results;
}


export function calculateVisa_funds_calculator(input: Visa_funds_calculatorInput): Visa_funds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCostLocal"] ?? 0;
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


export interface Visa_funds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
