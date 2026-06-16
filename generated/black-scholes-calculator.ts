// Auto-generated from black-scholes-calculator-schema.json
import * as z from 'zod';

export interface Black_scholes_calculatorInput {
  S: number;
  K: number;
  r: number;
  sigma: number;
  T: number;
}

export const Black_scholes_calculatorInputSchema = z.object({
  S: z.number().default(100),
  K: z.number().default(100),
  r: z.number().default(5),
  sigma: z.number().default(20),
  T: z.number().default(1),
});

function evaluateAllFormulas(input: Black_scholes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(x) { var a1 = 0.254829592; var a2 = -0.284496736; var a3 = 1.421413741; var a4 = -1.453152027; var a5 = 1.061405429; var p = 0.3275911; var sign = x < 0 ? -1 : 1; x = Math.abs(x) / Math.sqrt(2); var t = 1.0 / (1.0 + p * x); var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x); return 0.5 * (1.0 + sign * y); })(x); results["normcdf"] = Number.isFinite(v) ? v : 0; } catch { results["normcdf"] = 0; }
  try { const v = (Math.log(input.S / input.K) + (input.r / 100 + ((input.sigma / 100) ** 2) / 2) * input.T) / ((input.sigma / 100) * Math.sqrt(input.T)); results["d1"] = Number.isFinite(v) ? v : 0; } catch { results["d1"] = 0; }
  try { const v = (results["d1"] ?? 0) - (input.sigma / 100) * Math.sqrt(input.T); results["d2"] = Number.isFinite(v) ? v : 0; } catch { results["d2"] = 0; }
  try { const v = input.S * (results["normcdf"] ?? 0)((results["d1"] ?? 0)) - input.K * Math.exp(-(input.r / 100) * input.T) * (results["normcdf"] ?? 0)((results["d2"] ?? 0)); results["call"] = Number.isFinite(v) ? v : 0; } catch { results["call"] = 0; }
  try { const v = input.K * Math.exp(-(input.r / 100) * input.T) * (results["normcdf"] ?? 0)(-(results["d2"] ?? 0)) - input.S * (results["normcdf"] ?? 0)(-(results["d1"] ?? 0)); results["put"] = Number.isFinite(v) ? v : 0; } catch { results["put"] = 0; }
  return results;
}


export function calculateBlack_scholes_calculator(input: Black_scholes_calculatorInput): Black_scholes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["callPrice"] ?? 0;
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


export interface Black_scholes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
