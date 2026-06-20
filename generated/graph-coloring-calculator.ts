// Auto-generated from graph-coloring-calculator-schema.json
import * as z from 'zod';

export interface Graph_coloring_calculatorInput {
  measurement: number;
  target: number;
  lowerSpec: number;
  upperSpec: number;
  warningFraction: number;
  dataConfidence?: number;
}

export const Graph_coloring_calculatorInputSchema = z.object({
  measurement: z.number().default(10),
  target: z.number().default(10),
  lowerSpec: z.number().default(8),
  upperSpec: z.number().default(12),
  warningFraction: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Graph_coloring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.upperSpec - input.lowerSpec) / 2; results["specHalfRange"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["specHalfRange"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["specHalfRange"])) * input.warningFraction; results["warningHalfWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["warningHalfWidth"] = Number.NaN; }
  try { const v = (input.measurement >= input.lowerSpec && input.measurement <= input.upperSpec) ? 1 : 0; results["isWithinSpec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["isWithinSpec"] = Number.NaN; }
  try { const v = (input.measurement >= input.target - (toNumericFormulaValue(results["warningHalfWidth"])) && input.measurement <= input.target + (toNumericFormulaValue(results["warningHalfWidth"]))) ? 1 : 0; results["isGood"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["isGood"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["isWithinSpec"])) ? ((toNumericFormulaValue(results["isGood"])) ? 2 : 1) : 0; results["colorCode"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["colorCode"] = Number.NaN; }
  try { const v = input.measurement - input.target; results["deviation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deviation"] = Number.NaN; }
  try { const v = ((input.measurement - input.target) / (toNumericFormulaValue(results["specHalfRange"]))) * 100; results["percentDeviation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentDeviation"] = Number.NaN; }
  return results;
}


export function calculateGraph_coloring_calculator(input: Graph_coloring_calculatorInput): Graph_coloring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["colorCode"]);
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


export interface Graph_coloring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
