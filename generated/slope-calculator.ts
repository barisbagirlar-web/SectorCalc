// Auto-generated from slope-calculator-schema.json
import * as z from 'zod';

export interface Slope_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dataConfidence?: number;
}

export const Slope_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(10),
  y2: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Slope_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.y2 - input.y1; results["rise"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rise"] = Number.NaN; }
  try { const v = input.x2 - input.x1; results["run"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["run"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["run"])) !== 0 ? ((toNumericFormulaValue(results["rise"])) / (toNumericFormulaValue(results["run"]))) : null) ? 1 : 0); results["slopeRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slopeRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["run"])) !== 0 ? ((toNumericFormulaValue(results["rise"])) / (toNumericFormulaValue(results["run"]))) * 100 : null; results["slopePercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slopePercentage"] = Number.NaN; }
  return results;
}


export function calculateSlope_calculator(input: Slope_calculatorInput): Slope_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["slopePercentage"]);
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


export interface Slope_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
