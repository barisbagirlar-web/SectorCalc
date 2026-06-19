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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Excavation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth; results["originalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["originalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["originalVolume"])) * (1 + input.swellFactor/100); results["swellVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["swellVolume"] = 0; }
  try { const v = (asFormulaNumber(results["swellVolume"])) * (1 + input.wasteFactor/100); results["totalExcavationVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExcavationVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
