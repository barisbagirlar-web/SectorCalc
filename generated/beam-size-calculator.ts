// Auto-generated from beam-size-calculator-schema.json
import * as z from 'zod';

export interface Beam_size_calculatorInput {
  span: number;
  udl: number;
  allowableStress: number;
  elasticModulus: number;
  deflectionRatio: number;
  dataConfidence?: number;
}

export const Beam_size_calculatorInputSchema = z.object({
  span: z.number().default(3000),
  udl: z.number().default(10),
  allowableStress: z.number().default(160),
  elasticModulus: z.number().default(200000),
  deflectionRatio: z.number().default(360),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beam_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.udl * input.span * input.span / 8; results["M_max_Nmm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["M_max_Nmm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["M_max_Nmm"])) * input.span * input.span / (8 * input.elasticModulus * input.deflectionRatio); results["I_req_mm4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["I_req_mm4"] = Number.NaN; }
  try { const v = input.span / input.deflectionRatio; results["delta_allow_mm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["delta_allow_mm"] = Number.NaN; }
  return results;
}


export function calculateBeam_size_calculator(input: Beam_size_calculatorInput): Beam_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["I_req_mm4"]);
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


export interface Beam_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
