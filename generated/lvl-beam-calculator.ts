// Auto-generated from lvl-beam-calculator-schema.json
import * as z from 'zod';

export interface Lvl_beam_calculatorInput {
  span: number;
  load: number;
  width: number;
  depth: number;
  allowableStress: number;
  elasticModulus: number;
}

export const Lvl_beam_calculatorInputSchema = z.object({
  span: z.number().default(4),
  load: z.number().default(5),
  width: z.number().default(45),
  depth: z.number().default(200),
  allowableStress: z.number().default(30),
  elasticModulus: z.number().default(13),
});

function evaluateAllFormulas(input: Lvl_beam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.span * 1000; results["L_mm"] = Number.isFinite(v) ? v : 0; } catch { results["L_mm"] = 0; }
  try { const v = input.load * 1; results["w_Nmm"] = Number.isFinite(v) ? v : 0; } catch { results["w_Nmm"] = 0; }
  try { const v = (results["w_Nmm"] ?? 0) * (results["L_mm"] ?? 0) * (results["L_mm"] ?? 0) / 8; results["M_max"] = Number.isFinite(v) ? v : 0; } catch { results["M_max"] = 0; }
  try { const v = (results["w_Nmm"] ?? 0) * (results["L_mm"] ?? 0) / 2; results["V_max"] = Number.isFinite(v) ? v : 0; } catch { results["V_max"] = 0; }
  try { const v = input.width * input.depth * input.depth / 6; results["S"] = Number.isFinite(v) ? v : 0; } catch { results["S"] = 0; }
  try { const v = input.width * Math.pow(input.depth, 3) / 12; results["I"] = Number.isFinite(v) ? v : 0; } catch { results["I"] = 0; }
  try { const v = input.elasticModulus * 1000; results["E_MPa"] = Number.isFinite(v) ? v : 0; } catch { results["E_MPa"] = 0; }
  try { const v = (results["M_max"] ?? 0) / (results["S"] ?? 0); results["maxBendingStress"] = Number.isFinite(v) ? v : 0; } catch { results["maxBendingStress"] = 0; }
  try { const v = (5 * (results["w_Nmm"] ?? 0) * Math.pow((results["L_mm"] ?? 0), 4)) / (384 * (results["E_MPa"] ?? 0) * (results["I"] ?? 0)); results["maxDeflection"] = Number.isFinite(v) ? v : 0; } catch { results["maxDeflection"] = 0; }
  try { const v = (results["maxBendingStress"] ?? 0) / input.allowableStress; results["utilizationRatio"] = Number.isFinite(v) ? v : 0; } catch { results["utilizationRatio"] = 0; }
  return results;
}


export function calculateLvl_beam_calculator(input: Lvl_beam_calculatorInput): Lvl_beam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxBendingStress"] ?? 0;
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


export interface Lvl_beam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
