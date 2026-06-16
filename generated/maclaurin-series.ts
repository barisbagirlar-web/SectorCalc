// Auto-generated from maclaurin-series-schema.json
import * as z from 'zod';

export interface Maclaurin_seriesInput {
  function: number;
  center: number;
  x_value: number;
  terms: number;
}

export const Maclaurin_seriesInputSchema = z.object({
  function: z.number(),
  center: z.number().default(0),
  x_value: z.number().default(0.5),
  terms: z.number().default(5),
});

function evaluateAllFormulas(input: Maclaurin_seriesInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let sum = 0; for(let k=0; k<input.terms; k++) { let coeff = (k%2===0 ? 1 : -1) / factorial(2*k+1); sum += coeff * Math.pow(input.x_value, 2*k+1); return } sum; })(); results["approximation"] = Number.isFinite(v) ? v : 0; } catch { results["approximation"] = 0; }
  try { const v = Math.sin(input.x_value); results["exact"] = Number.isFinite(v) ? v : 0; } catch { results["exact"] = 0; }
  try { const v = Math.abs((results["approximation"] ?? 0) - (results["exact"] ?? 0)); results["error"] = Number.isFinite(v) ? v : 0; } catch { results["error"] = 0; }
  return results;
}


export function calculateMaclaurin_series(input: Maclaurin_seriesInput): Maclaurin_seriesOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["approximation"] ?? 0;
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


export interface Maclaurin_seriesOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
