// Auto-generated from excavation-calculator-schema.json
import * as z from 'zod';

export interface Excavation_calculatorInput {
  length: number;
  width: number;
  depth: number;
  swellFactor: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Excavation_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  depth: z.number().default(2),
  swellFactor: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Excavation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth; results["originalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["originalVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["originalVolume"])) * (1 + input.swellFactor/100); results["swellVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["swellVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["swellVolume"])) * (1 + input.wasteFactor/100); results["totalExcavationVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalExcavationVolume"] = Number.NaN; }
  return results;
}


export function calculateExcavation_calculator(input: Excavation_calculatorInput): Excavation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["originalVolume"]);
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


export interface Excavation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
