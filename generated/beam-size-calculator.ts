// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beam_size_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.udl * input.span * input.span / 8; results["M_max_Nmm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["M_max_Nmm"] = 0; }
  try { const v = (asFormulaNumber(results["M_max_Nmm"])) * input.span * input.span / (8 * input.elasticModulus * input.deflectionRatio); results["I_req_mm4"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["I_req_mm4"] = 0; }
  try { const v = input.span / input.deflectionRatio; results["delta_allow_mm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["delta_allow_mm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBeam_size_calculator(input: Beam_size_calculatorInput): Beam_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["I_req_mm4"]);
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


export interface Beam_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
