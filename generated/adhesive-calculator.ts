// Auto-generated from adhesive-calculator-schema.json
import * as z from 'zod';

export interface Adhesive_calculatorInput {
  length: number;
  width: number;
  coverageRate: number;
  wasteFactor: number;
  layers: number;
  dataConfidence?: number;
}

export const Adhesive_calculatorInputSchema = z.object({
  length: z.number().default(1),
  width: z.number().default(1),
  coverageRate: z.number().default(1.5),
  wasteFactor: z.number().default(5),
  layers: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Adhesive_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["area"])) * input.coverageRate * input.layers; results["netAdhesive"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAdhesive"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netAdhesive"])) * input.wasteFactor / 100; results["waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netAdhesive"])) + (toNumericFormulaValue(results["waste"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  return results;
}


export function calculateAdhesive_calculator(input: Adhesive_calculatorInput): Adhesive_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Adhesive_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
