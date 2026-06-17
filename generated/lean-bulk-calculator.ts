// Auto-generated from lean-bulk-calculator-schema.json
import * as z from 'zod';

export interface Lean_bulk_calculatorInput {
  dailyProduction: number;
  materialPerUnit: number;
  containerCapacity: number;
  safetyStockDays: number;
  leadTimeDays: number;
  reorderPointMultiplier: number;
}

export const Lean_bulk_calculatorInputSchema = z.object({
  dailyProduction: z.number().default(1000),
  materialPerUnit: z.number().default(0.5),
  containerCapacity: z.number().default(25),
  safetyStockDays: z.number().default(2),
  leadTimeDays: z.number().default(5),
  reorderPointMultiplier: z.number().default(1.2),
});

function evaluateAllFormulas(input: Lean_bulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyProduction * input.materialPerUnit; results["totalDailyMaterial"] = Number.isFinite(v) ? v : 0; } catch { results["totalDailyMaterial"] = 0; }
  try { const v = (results["totalDailyMaterial"] ?? 0) * (input.leadTimeDays + input.safetyStockDays) * input.reorderPointMultiplier; results["totalBulkRequired"] = Number.isFinite(v) ? v : 0; } catch { results["totalBulkRequired"] = 0; }
  try { const v = Math.ceil((results["totalBulkRequired"] ?? 0) / input.containerCapacity); results["numberOfContainers"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfContainers"] = 0; }
  try { const v = (results["totalDailyMaterial"] ?? 0) / input.containerCapacity; results["avgDailyContainers"] = Number.isFinite(v) ? v : 0; } catch { results["avgDailyContainers"] = 0; }
  return results;
}


export function calculateLean_bulk_calculator(input: Lean_bulk_calculatorInput): Lean_bulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDailyMaterial"] ?? 0;
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


export interface Lean_bulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
