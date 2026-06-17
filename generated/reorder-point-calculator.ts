// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reorder_point_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.averageDailyUsage * input.leadTime; results["averageDemandDuringLeadTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["averageDemandDuringLeadTime"] = 0; }
  try { const v = input.averageDailyUsage * input.leadTime; results["averageDemandDuringLeadTime_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["averageDemandDuringLeadTime_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateReorder_point_calculator(input: Reorder_point_calculatorInput): Reorder_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["averageDemandDuringLeadTime_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
