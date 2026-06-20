// Auto-generated from dots-calculator-schema.json
import * as z from 'zod';

export interface Dots_calculatorInput {
  onHandInventory: number;
  averageDailyUsage: number;
  safetyStock: number;
  leadTimeDays: number;
  dataConfidence?: number;
}

export const Dots_calculatorInputSchema = z.object({
  onHandInventory: z.number().default(5000),
  averageDailyUsage: z.number().default(200),
  safetyStock: z.number().default(1000),
  leadTimeDays: z.number().default(7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dots_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.onHandInventory / input.averageDailyUsage; results["dos"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dos"] = Number.NaN; }
  try { const v = (input.onHandInventory + input.safetyStock) / input.averageDailyUsage; results["dosWithSafety"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dosWithSafety"] = Number.NaN; }
  try { const v = input.leadTimeDays * input.averageDailyUsage; results["reorderPoint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reorderPoint"] = Number.NaN; }
  return results;
}


export function calculateDots_calculator(input: Dots_calculatorInput): Dots_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dos"]);
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


export interface Dots_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
