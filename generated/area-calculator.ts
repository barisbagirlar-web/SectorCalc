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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.room1Length * input.room1Width; results["area1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area1"] = 0; }
  try { const v = input.room2Length * input.room2Width; results["area2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area2"] = 0; }
  try { const v = ((asFormulaNumber(results["area1"])) + (asFormulaNumber(results["area2"]))) * (1 + input.wasteFactor / 100); results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateArea_calculator(input: Area_calculatorInput): Area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalArea"]));
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


export interface Area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
