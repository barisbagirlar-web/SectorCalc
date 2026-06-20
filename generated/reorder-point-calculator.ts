// Auto-generated from reorder-point-calculator-schema.json
import * as z from 'zod';

export interface Reorder_point_calculatorInput {
  averageDailyUsage: number;
  leadTime: number;
  dailyDemandStdDev: number;
  serviceLevelZ: number;
  dataConfidence?: number;
}

export const Reorder_point_calculatorInputSchema = z.object({
  averageDailyUsage: z.number().default(100),
  leadTime: z.number().default(7),
  dailyDemandStdDev: z.number().default(15),
  serviceLevelZ: z.number().default(1.65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reorder_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageDailyUsage * input.leadTime; results["averageDemandDuringLeadTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageDemandDuringLeadTime"] = Number.NaN; }
  try { const v = input.averageDailyUsage * input.leadTime; results["averageDemandDuringLeadTime_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageDemandDuringLeadTime_aux"] = Number.NaN; }
  return results;
}


export function calculateReorder_point_calculator(input: Reorder_point_calculatorInput): Reorder_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["averageDemandDuringLeadTime_aux"]);
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


export interface Reorder_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
