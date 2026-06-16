// Auto-generated from options-calculator-schema.json
import * as z from 'zod';

export interface Options_calculatorInput {
  optionType: number;
  S: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
}

export const Options_calculatorInputSchema = z.object({
  optionType: z.number().default(1),
  S: z.number().default(100),
  K: z.number().default(100),
  T: z.number().default(1),
  r: z.number().default(5),
  sigma: z.number().default(20),
});

function evaluateAllFormulas(input: Options_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(x) { var a=[0.254829592,-0.284496736,1.421413741,-1.453152027,1.061405429],p=0.3275911,sign=x<0?-1:1; x=Math.abs(x)/Math.sqrt(2); var t=1/(1+p*x); var y=1-((((a[4]*t+a[3])*t+a[2])*t+a[1])*t+a[0])*t*Math.exp(-x*x); return 0.5*(1+sign*y); })(x); results["normCDF"] = Number.isFinite(v) ? v : 0; } catch { results["normCDF"] = 0; }
  try { const v = input.r / 100; results["r_dec"] = Number.isFinite(v) ? v : 0; } catch { results["r_dec"] = 0; }
  try { const v = input.sigma / 100; results["sigma_dec"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_dec"] = 0; }
  try { const v = (Math.log(input.S / input.K) + ((results["r_dec"] ?? 0) + (results["sigma_dec"] ?? 0) ** 2 / 2) * input.T) / ((results["sigma_dec"] ?? 0) * Math.sqrt(input.T)); results["d1"] = Number.isFinite(v) ? v : 0; } catch { results["d1"] = 0; }
  try { const v = (results["d1"] ?? 0) - (results["sigma_dec"] ?? 0) * Math.sqrt(input.T); results["d2"] = Number.isFinite(v) ? v : 0; } catch { results["d2"] = 0; }
  try { const v = input.S * (results["normCDF"] ?? 0)((results["d1"] ?? 0)) - input.K * Math.exp(-(results["r_dec"] ?? 0) * input.T) * (results["normCDF"] ?? 0)((results["d2"] ?? 0)); results["call"] = Number.isFinite(v) ? v : 0; } catch { results["call"] = 0; }
  try { const v = input.K * Math.exp(-(results["r_dec"] ?? 0) * input.T) * (results["normCDF"] ?? 0)(-(results["d2"] ?? 0)) - input.S * (results["normCDF"] ?? 0)(-(results["d1"] ?? 0)); results["put"] = Number.isFinite(v) ? v : 0; } catch { results["put"] = 0; }
  try { const v = input.optionType === 1 ? (results["call"] ?? 0) : (results["put"] ?? 0); results["optionPrice"] = Number.isFinite(v) ? v : 0; } catch { results["optionPrice"] = 0; }
  try { const v = (results["normCDF"] ?? 0)((results["d1"] ?? 0)); results["callDelta"] = Number.isFinite(v) ? v : 0; } catch { results["callDelta"] = 0; }
  try { const v = (results["normCDF"] ?? 0)((results["d1"] ?? 0)) - 1; results["putDelta"] = Number.isFinite(v) ? v : 0; } catch { results["putDelta"] = 0; }
  return results;
}


export function calculateOptions_calculator(input: Options_calculatorInput): Options_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["optionPrice"] ?? 0;
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


export interface Options_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
