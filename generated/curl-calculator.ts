// Auto-generated from curl-calculator-schema.json
import * as z from 'zod';

export interface Curl_calculatorInput {
  dFz_dy: number;
  dFy_dz: number;
  dFx_dz: number;
  dFz_dx: number;
  dFy_dx: number;
  dFx_dy: number;
}

export const Curl_calculatorInputSchema = z.object({
  dFz_dy: z.number().default(0),
  dFy_dz: z.number().default(0),
  dFx_dz: z.number().default(0),
  dFz_dx: z.number().default(0),
  dFy_dx: z.number().default(0),
  dFx_dy: z.number().default(0),
});

function evaluateAllFormulas(input: Curl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dFz_dy - input.dFy_dz; results["curl_x"] = Number.isFinite(v) ? v : 0; } catch { results["curl_x"] = 0; }
  try { const v = input.dFx_dz - input.dFz_dx; results["curl_y"] = Number.isFinite(v) ? v : 0; } catch { results["curl_y"] = 0; }
  try { const v = input.dFy_dx - input.dFx_dy; results["curl_z"] = Number.isFinite(v) ? v : 0; } catch { results["curl_z"] = 0; }
  try { const v = Math.sqrt((results["curl_x"] ?? 0)*(results["curl_x"] ?? 0) + (results["curl_y"] ?? 0)*(results["curl_y"] ?? 0) + (results["curl_z"] ?? 0)*(results["curl_z"] ?? 0)); results["curl_mag"] = Number.isFinite(v) ? v : 0; } catch { results["curl_mag"] = 0; }
  return results;
}


export function calculateCurl_calculator(input: Curl_calculatorInput): Curl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["curl_mag"] ?? 0;
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


export interface Curl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
