// Auto-generated from dots-calculator-schema.json
import * as z from 'zod';

export interface Dots_calculatorInput {
  onHandInventory: number;
  averageDailyUsage: number;
  safetyStock: number;
  leadTimeDays: number;
}

export const Dots_calculatorInputSchema = z.object({
  onHandInventory: z.number().default(5000),
  averageDailyUsage: z.number().default(200),
  safetyStock: z.number().default(1000),
  leadTimeDays: z.number().default(7),
});

function evaluateAllFormulas(input: Dots_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.onHandInventory / input.averageDailyUsage; results["dos"] = Number.isFinite(v) ? v : 0; } catch { results["dos"] = 0; }
  try { const v = (input.onHandInventory + input.safetyStock) / input.averageDailyUsage; results["dosWithSafety"] = Number.isFinite(v) ? v : 0; } catch { results["dosWithSafety"] = 0; }
  try { const v = input.leadTimeDays * input.averageDailyUsage; results["reorderPoint"] = Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  return results;
}


export function calculateDots_calculator(input: Dots_calculatorInput): Dots_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dos"] ?? 0;
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


export interface Dots_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
