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

function evaluateAllFormulas(input: Grout_calculator_for_tile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tileLength / 1000; results["L_m"] = Number.isFinite(v) ? v : 0; } catch { results["L_m"] = 0; }
  try { const v = input.tileWidth / 1000; results["W_m"] = Number.isFinite(v) ? v : 0; } catch { results["W_m"] = 0; }
  try { const v = input.jointWidth / 1000; results["J_m"] = Number.isFinite(v) ? v : 0; } catch { results["J_m"] = 0; }
  try { const v = input.tileThickness / 1000; results["D_m"] = Number.isFinite(v) ? v : 0; } catch { results["D_m"] = 0; }
  try { const v = (((results["L_m"] ?? 0) + (results["W_m"] ?? 0)) / ((results["L_m"] ?? 0) * (results["W_m"] ?? 0))) * (results["J_m"] ?? 0) * (results["D_m"] ?? 0) * input.wasteFactor * 1000; results["volumePerM2"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerM2"] = 0; }
  try { const v = (results["volumePerM2"] ?? 0) * input.area; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * input.groutDensity; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = Math.ceil(input.area / ((input.tileLength/1000) * (input.tileWidth/1000))); results["tilesNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["tilesNeeded"] = 0; }
  results["__volumePerM2_toFixed_2___L_m_"] = 0;
  results["__totalVolume_toFixed_2___L"] = 0;
  results["__tilesNeeded__pieces"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateGrout_calculator_for_tile_calculator(input: Grout_calculator_for_tile_calculatorInput): Grout_calculator_for_tile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
