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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Slope_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.y2 - input.y1; results["rise"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rise"] = 0; }
  try { const v = input.x2 - input.x1; results["run"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["run"] = 0; }
  try { const v = (((asFormulaNumber(results["run"])) !== 0 ? ((asFormulaNumber(results["rise"])) / (asFormulaNumber(results["run"]))) : null) ? 1 : 0); results["slopeRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["slopeRatio"] = 0; }
  try { const v = (asFormulaNumber(results["run"])) !== 0 ? ((asFormulaNumber(results["rise"])) / (asFormulaNumber(results["run"]))) * 100 : null; results["slopePercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["slopePercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSlope_calculator(input: Slope_calculatorInput): Slope_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["slopePercentage"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
