// Auto-generated from crochet-calculator-schema.json
import * as z from 'zod';

export interface Crochet_calculatorInput {
  projectWidth: number;
  projectHeight: number;
  swatchWidth: number;
  swatchHeight: number;
  swatchWeight: number;
  skeinWeight: number;
  skeinLength: number;
  yarnCostPerSkein: number;
  dataConfidence?: number;
}

export const Crochet_calculatorInputSchema = z.object({
  projectWidth: z.number().default(100),
  projectHeight: z.number().default(150),
  swatchWidth: z.number().default(10),
  swatchHeight: z.number().default(10),
  swatchWeight: z.number().default(10),
  skeinWeight: z.number().default(50),
  skeinLength: z.number().default(100),
  yarnCostPerSkein: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crochet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.projectWidth * input.projectHeight) * (input.swatchWeight / (input.swatchWidth * input.swatchHeight)); results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = ((input.projectWidth * input.projectHeight) * (input.swatchWeight / (input.swatchWidth * input.swatchHeight)) / input.skeinWeight) * input.skeinLength; results["totalMeters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMeters"] = Number.NaN; }
  return results;
}


export function calculateCrochet_calculator(input: Crochet_calculatorInput): Crochet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMeters"]);
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


export interface Crochet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
