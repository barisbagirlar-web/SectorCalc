// @ts-nocheck
// Auto-generated from cannabis-calculator-schema.json
import * as z from 'zod';

export interface Cannabis_calculatorInput {
  initial_cannabinoid_mg: number;
  solvent_volume_ml: number;
  extraction_time_min: number;
  temperature_c: number;
  k0: number;
  Ea: number;
}

export const Cannabis_calculatorInputSchema = z.object({
  initial_cannabinoid_mg: z.number().default(1000),
  solvent_volume_ml: z.number().default(500),
  extraction_time_min: z.number().default(60),
  temperature_c: z.number().default(25),
  k0: z.number().default(0.01),
  Ea: z.number().default(50000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cannabis_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.initial_cannabinoid_mg * input.solvent_volume_ml * input.extraction_time_min * input.temperature_c; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.initial_cannabinoid_mg * input.solvent_volume_ml * input.extraction_time_min * input.temperature_c * (input.k0 * input.Ea); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.k0 * input.Ea; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCannabis_calculator(input: Cannabis_calculatorInput): Cannabis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cannabis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
