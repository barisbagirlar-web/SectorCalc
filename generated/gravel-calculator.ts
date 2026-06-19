// Auto-generated from gravel-calculator-schema.json
import * as z from 'zod';

export interface Gravel_calculatorInput {
  length: number;
  width: number;
  depth: number;
  compactionFactor: number;
  wasteFactor: number;
  density: number;
  dataConfidence?: number;
}

export const Gravel_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(10),
  depth: z.number().default(2),
  compactionFactor: z.number().default(5),
  wasteFactor: z.number().default(10),
  density: z.number().default(120),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gravel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * (input.depth / 12); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) * (1 + input.compactionFactor / 100) * (1 + input.wasteFactor / 100); results["adjustedVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedVolume"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedVolume"])) * input.density / 2000; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedVolume"])) / 27; results["cubicYards"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cubicYards"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGravel_calculator(input: Gravel_calculatorInput): Gravel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volume"]);
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


export interface Gravel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
