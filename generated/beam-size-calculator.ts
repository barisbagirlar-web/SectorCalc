// Auto-generated from beam-size-calculator-schema.json
import * as z from 'zod';

export interface Beam_size_calculatorInput {
  span: number;
  udl: number;
  allowableStress: number;
  elasticModulus: number;
  deflectionRatio: number;
}

export const Beam_size_calculatorInputSchema = z.object({
  span: z.number().default(3000),
  udl: z.number().default(10),
  allowableStress: z.number().default(160),
  elasticModulus: z.number().default(200000),
  deflectionRatio: z.number().default(360),
});

function evaluateAllFormulas(input: Beam_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.udl * Math.pow(input.span, 2) / 8) / input.allowableStress; results["S_req_mm3"] = Number.isFinite(v) ? v : 0; } catch { results["S_req_mm3"] = 0; }
  try { const v = (5 * input.udl * Math.pow(input.span, 3) * input.deflectionRatio) / (384 * input.elasticModulus); results["I_req_mm4"] = Number.isFinite(v) ? v : 0; } catch { results["I_req_mm4"] = 0; }
  try { const v = input.udl * Math.pow(input.span, 2) / 8; results["M_max_Nmm"] = Number.isFinite(v) ? v : 0; } catch { results["M_max_Nmm"] = 0; }
  try { const v = input.span / input.deflectionRatio; results["delta_allow_mm"] = Number.isFinite(v) ? v : 0; } catch { results["delta_allow_mm"] = 0; }
  return results;
}


export function calculateBeam_size_calculator(input: Beam_size_calculatorInput): Beam_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["S_req_mm3"] ?? 0;
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


export interface Beam_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
