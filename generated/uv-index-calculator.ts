// Auto-generated from uv-index-calculator-schema.json
import * as z from 'zod';

export interface Uv_index_calculatorInput {
  sza: number;
  ozone: number;
  altitude: number;
  albedo: number;
  aod: number;
  cloudCover: number;
  dataConfidence?: number;
}

export const Uv_index_calculatorInputSchema = z.object({
  sza: z.number().default(30),
  ozone: z.number().default(300),
  altitude: z.number().default(0),
  albedo: z.number().default(0.05),
  aod: z.number().default(0.1),
  cloudCover: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Uv_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sza * input.ozone * input.altitude * input.albedo; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sza * input.ozone * input.altitude * input.albedo * (input.aod * input.cloudCover); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.aod * input.cloudCover; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUv_index_calculator(input: Uv_index_calculatorInput): Uv_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Uv_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
