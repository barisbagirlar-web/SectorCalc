// Auto-generated from reorder-point-calculator-schema.json
import * as z from 'zod';

export interface Reorder_point_calculatorInput {
  averageDailyUsage: number;
  leadTime: number;
  dailyDemandStdDev: number;
  serviceLevelZ: number;
}

export const Reorder_point_calculatorInputSchema = z.object({
  averageDailyUsage: z.number().default(100),
  leadTime: z.number().default(7),
  dailyDemandStdDev: z.number().default(15),
  serviceLevelZ: z.number().default(1.65),
});

function evaluateAllFormulas(input: Reorder_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageDailyUsage * input.leadTime; results["averageDemandDuringLeadTime"] = Number.isFinite(v) ? v : 0; } catch { results["averageDemandDuringLeadTime"] = 0; }
  try { const v = input.serviceLevelZ * input.dailyDemandStdDev * Math.sqrt(input.leadTime); results["safetyStock"] = Number.isFinite(v) ? v : 0; } catch { results["safetyStock"] = 0; }
  try { const v = (results["averageDemandDuringLeadTime"] ?? 0) + (results["safetyStock"] ?? 0); results["reorderPoint"] = Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  return results;
}


export function calculateReorder_point_calculator(input: Reorder_point_calculatorInput): Reorder_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["reorderPoint"] ?? 0;
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


export interface Reorder_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
