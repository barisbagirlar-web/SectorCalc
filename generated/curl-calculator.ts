// Auto-generated from curl-calculator-schema.json
import * as z from 'zod';

export interface Curl_calculatorInput {
  dFz_dy: number;
  dFy_dz: number;
  dFx_dz: number;
  dFz_dx: number;
  dFy_dx: number;
  dFx_dy: number;
  dataConfidence?: number;
}

export const Curl_calculatorInputSchema = z.object({
  dFz_dy: z.number().default(0),
  dFy_dz: z.number().default(0),
  dFx_dz: z.number().default(0),
  dFz_dx: z.number().default(0),
  dFy_dx: z.number().default(0),
  dFx_dy: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Curl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dFz_dy - input.dFy_dz; results["curl_x"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["curl_x"] = Number.NaN; }
  try { const v = input.dFx_dz - input.dFz_dx; results["curl_y"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["curl_y"] = Number.NaN; }
  try { const v = input.dFy_dx - input.dFx_dy; results["curl_z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["curl_z"] = Number.NaN; }
  return results;
}


export function calculateCurl_calculator(input: Curl_calculatorInput): Curl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["curl_z"]);
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


export interface Curl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
