// Auto-generated from doms-calculator-schema.json
import * as z from 'zod';

export interface Doms_calculatorInput {
  plannedProductionTime: number;
  actualRunTime: number;
  idealCycleTime: number;
  totalCount: number;
  goodCount: number;
  dataConfidence?: number;
}

export const Doms_calculatorInputSchema = z.object({
  plannedProductionTime: z.number().default(8),
  actualRunTime: z.number().default(7.5),
  idealCycleTime: z.number().default(0.5),
  totalCount: z.number().default(800),
  goodCount: z.number().default(760),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Doms_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actualRunTime / input.plannedProductionTime; results["availability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.idealCycleTime * input.totalCount) / (input.actualRunTime * 60); results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = input.goodCount / input.totalCount; results["quality"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = (asFormulaNumber(results["availability"])) * (asFormulaNumber(results["performance"])) * (asFormulaNumber(results["quality"])); results["oee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oee"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDoms_calculator(input: Doms_calculatorInput): Doms_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["oee"]);
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


export interface Doms_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
