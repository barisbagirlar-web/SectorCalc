// Auto-generated from lean-bulk-calculator-schema.json
import * as z from 'zod';

export interface Lean_bulk_calculatorInput {
  dailyProduction: number;
  materialPerUnit: number;
  containerCapacity: number;
  safetyStockDays: number;
  leadTimeDays: number;
  reorderPointMultiplier: number;
  dataConfidence?: number;
}

export const Lean_bulk_calculatorInputSchema = z.object({
  dailyProduction: z.number().default(1000),
  materialPerUnit: z.number().default(0.5),
  containerCapacity: z.number().default(25),
  safetyStockDays: z.number().default(2),
  leadTimeDays: z.number().default(5),
  reorderPointMultiplier: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lean_bulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyProduction * input.materialPerUnit; results["totalDailyMaterial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDailyMaterial"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDailyMaterial"])) * (input.leadTimeDays + input.safetyStockDays) * input.reorderPointMultiplier; results["totalBulkRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBulkRequired"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDailyMaterial"])) / input.containerCapacity; results["avgDailyContainers"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["avgDailyContainers"] = Number.NaN; }
  return results;
}


export function calculateLean_bulk_calculator(input: Lean_bulk_calculatorInput): Lean_bulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDailyMaterial"]);
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


export interface Lean_bulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
