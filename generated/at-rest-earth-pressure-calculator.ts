// Auto-generated from at-rest-earth-pressure-calculator-schema.json
import * as z from 'zod';

export interface At_rest_earth_pressure_calculatorInput {
  sigma_v: number;
  phi: number;
  OCR: number;
  SF: number;
}

export const At_rest_earth_pressure_calculatorInputSchema = z.object({
  sigma_v: z.number().default(100),
  phi: z.number().default(30),
  OCR: z.number().default(1),
  SF: z.number().default(1.5),
});

function evaluateAllFormulas(input: At_rest_earth_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - Math.sin(input.phi * Math.PI/180)) * Math.pow(input.OCR, Math.sin(input.phi * Math.PI/180)); results["K0"] = Number.isFinite(v) ? v : 0; } catch { results["K0"] = 0; }
  try { const v = (results["K0"] ?? 0) * input.sigma_v; results["sigma_h"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_h"] = 0; }
  try { const v = (results["sigma_h"] ?? 0) * input.SF; results["sigma_h_design"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_h_design"] = 0; }
  return results;
}


export function calculateAt_rest_earth_pressure_calculator(input: At_rest_earth_pressure_calculatorInput): At_rest_earth_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sigma_h_design"] ?? 0;
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


export interface At_rest_earth_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
