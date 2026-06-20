// Auto-generated from area-calculator-schema.json
import * as z from 'zod';

export interface Area_calculatorInput {
  room1Length: number;
  room1Width: number;
  room2Length: number;
  room2Width: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Area_calculatorInputSchema = z.object({
  room1Length: z.number().default(5),
  room1Width: z.number().default(4),
  room2Length: z.number().default(3),
  room2Width: z.number().default(2),
  wasteFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.room1Length * input.room1Width; results["area1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area1"] = Number.NaN; }
  try { const v = input.room2Length * input.room2Width; results["area2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area2"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["area1"])) + (toNumericFormulaValue(results["area2"]))) * (1 + input.wasteFactor / 100); results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalArea"] = Number.NaN; }
  return results;
}


export function calculateArea_calculator(input: Area_calculatorInput): Area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalArea"]);
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


export interface Area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
