// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grout_calculator_for_tile_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.tileLength / 1000; results["L_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["L_m"] = 0; }
  try { const v = input.tileWidth / 1000; results["W_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["W_m"] = 0; }
  try { const v = input.jointWidth / 1000; results["J_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["J_m"] = 0; }
  try { const v = input.tileThickness / 1000; results["D_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["D_m"] = 0; }
  try { const v = (((asFormulaNumber(results["L_m"])) + (asFormulaNumber(results["W_m"]))) / ((asFormulaNumber(results["L_m"])) * (asFormulaNumber(results["W_m"])))) * (asFormulaNumber(results["J_m"])) * (asFormulaNumber(results["D_m"])) * input.wasteFactor * 1000; results["volumePerM2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumePerM2"] = 0; }
  try { const v = (asFormulaNumber(results["volumePerM2"])) * input.area; results["totalVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) * input.groutDensity; results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGrout_calculator_for_tile_calculator(input: Grout_calculator_for_tile_calculatorInput): Grout_calculator_for_tile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeight"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
