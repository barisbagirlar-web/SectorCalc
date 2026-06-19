// Auto-generated from resin-calculator-schema.json
import * as z from 'zod';

export interface Resin_calculatorInput {
  area: number;
  thickness: number;
  resinRatio: number;
  hardenerRatio: number;
  resinDensity: number;
  hardenerDensity: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Resin_calculatorInputSchema = z.object({
  area: z.number().default(1),
  thickness: z.number().default(1),
  resinRatio: z.number().default(100),
  hardenerRatio: z.number().default(50),
  resinDensity: z.number().default(1.1),
  hardenerDensity: z.number().default(0.95),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Resin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.thickness; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = ((asFormulaNumber(results["totalVolume"])) / ((input.resinRatio / input.hardenerRatio) / input.resinDensity + 1 / input.hardenerDensity)) * (input.resinRatio / input.hardenerRatio) * (1 + input.wasteFactor / 100); results["resinWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resinWeight"] = 0; }
  try { const v = ((asFormulaNumber(results["totalVolume"])) / ((input.resinRatio / input.hardenerRatio) / input.resinDensity + 1 / input.hardenerDensity)) * (1 + input.wasteFactor / 100); results["hardenerWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hardenerWeight"] = 0; }
  try { const v = (asFormulaNumber(results["resinWeight"])) / input.resinDensity; results["resinVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resinVolume"] = 0; }
  try { const v = (asFormulaNumber(results["hardenerWeight"])) / input.hardenerDensity; results["hardenerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hardenerVolume"] = 0; }
  try { const v = (asFormulaNumber(results["resinWeight"])) + (asFormulaNumber(results["hardenerWeight"])); results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateResin_calculator(input: Resin_calculatorInput): Resin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeight"]);
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


export interface Resin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
