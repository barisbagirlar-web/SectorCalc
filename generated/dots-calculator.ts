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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dots_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.onHandInventory / input.averageDailyUsage; results["dos"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dos"] = 0; }
  try { const v = (input.onHandInventory + input.safetyStock) / input.averageDailyUsage; results["dosWithSafety"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dosWithSafety"] = 0; }
  try { const v = input.leadTimeDays * input.averageDailyUsage; results["reorderPoint"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDots_calculator(input: Dots_calculatorInput): Dots_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dos"]));
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


export interface Dots_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
