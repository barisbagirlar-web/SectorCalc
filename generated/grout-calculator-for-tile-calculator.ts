// Auto-generated from grout-calculator-for-tile-calculator-schema.json
import * as z from 'zod';

export interface Grout_calculator_for_tile_calculatorInput {
  tileLength: number;
  tileWidth: number;
  jointWidth: number;
  tileThickness: number;
  area: number;
  wasteFactor: number;
  groutDensity: number;
  dataConfidence?: number;
}

export const Grout_calculator_for_tile_calculatorInputSchema = z.object({
  tileLength: z.number().default(300),
  tileWidth: z.number().default(300),
  jointWidth: z.number().default(3),
  tileThickness: z.number().default(10),
  area: z.number().default(10),
  wasteFactor: z.number().default(1.2),
  groutDensity: z.number().default(1.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Grout_calculator_for_tile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tileLength / 1000; results["L_m"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["L_m"] = Number.NaN; }
  try { const v = input.tileWidth / 1000; results["W_m"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["W_m"] = Number.NaN; }
  try { const v = input.jointWidth / 1000; results["J_m"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["J_m"] = Number.NaN; }
  try { const v = input.tileThickness / 1000; results["D_m"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["D_m"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["L_m"])) + (toNumericFormulaValue(results["W_m"]))) / ((toNumericFormulaValue(results["L_m"])) * (toNumericFormulaValue(results["W_m"])))) * (toNumericFormulaValue(results["J_m"])) * (toNumericFormulaValue(results["D_m"])) * input.wasteFactor * 1000; results["volumePerM2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumePerM2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volumePerM2"])) * input.area; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalVolume"])) * input.groutDensity; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  return results;
}


export function calculateGrout_calculator_for_tile_calculator(input: Grout_calculator_for_tile_calculatorInput): Grout_calculator_for_tile_calculatorOutput {
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


export interface Grout_calculator_for_tile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
