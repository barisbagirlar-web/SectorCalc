// Auto-generated from crane-load-calculator-schema.json
import * as z from 'zod';

export interface Crane_load_calculatorInput {
  liftedLoad: number;
  riggingWeight: number;
  dynamicFactor: number;
  windFactor: number;
  dataConfidence?: number;
}

export const Crane_load_calculatorInputSchema = z.object({
  liftedLoad: z.number().default(10),
  riggingWeight: z.number().default(1),
  dynamicFactor: z.number().default(1.2),
  windFactor: z.number().default(1.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crane_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.liftedLoad + input.riggingWeight; results["staticLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["staticLoad"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["staticLoad"])) * input.dynamicFactor; results["dynamicLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dynamicLoad"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dynamicLoad"])) * input.windFactor; results["totalLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLoad"] = Number.NaN; }
  return results;
}


export function calculateCrane_load_calculator(input: Crane_load_calculatorInput): Crane_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLoad"]);
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


export interface Crane_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
