// Auto-generated from lean-bulk-calculator-schema.json
import * as z from 'zod';

export interface Lean_bulk_calculatorInput {
  annualDemand: number;
  setupCost: number;
  holdingCost: number;
  annualProductionRate: number;
  workingDays: number;
}

export const Lean_bulk_calculatorInputSchema = z.object({
  annualDemand: z.number().default(12000),
  setupCost: z.number().default(50),
  holdingCost: z.number().default(2.5),
  annualProductionRate: z.number().default(24000),
  workingDays: z.number().default(250),
});

function evaluateAllFormulas(input: Lean_bulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand / input.workingDays; results["dailyDemand"] = Number.isFinite(v) ? v : 0; } catch { results["dailyDemand"] = 0; }
  try { const v = input.annualProductionRate / input.workingDays; results["dailyProduction"] = Number.isFinite(v) ? v : 0; } catch { results["dailyProduction"] = 0; }
  try { const v = Math.sqrt((2 * input.annualDemand * input.setupCost) / (input.holdingCost * (1 - (results["dailyDemand"] ?? 0) / (results["dailyProduction"] ?? 0)))); results["optimalBatchSize"] = Number.isFinite(v) ? v : 0; } catch { results["optimalBatchSize"] = 0; }
  try { const v = (results["optimalBatchSize"] ?? 0) / (results["dailyDemand"] ?? 0); results["cycleLengthDays"] = Number.isFinite(v) ? v : 0; } catch { results["cycleLengthDays"] = 0; }
  try { const v = input.annualDemand / (results["optimalBatchSize"] ?? 0); results["setupsPerYear"] = Number.isFinite(v) ? v : 0; } catch { results["setupsPerYear"] = 0; }
  return results;
}


export function calculateLean_bulk_calculator(input: Lean_bulk_calculatorInput): Lean_bulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["optimalBatchSize"] ?? 0;
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
