// Auto-generated from ncr-calculator-schema.json
import * as z from 'zod';

export interface Ncr_calculatorInput {
  n: number;
  r: number;
  decimalPlaces: number;
  maxIterations: number;
}

export const Ncr_calculatorInputSchema = z.object({
  n: z.number().default(10),
  r: z.number().default(3),
  decimalPlaces: z.number().default(0),
  maxIterations: z.number().default(1000),
});

function evaluateAllFormulas(input: Ncr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); }); results["factorial"] = Number.isFinite(v) ? v : 0; } catch { results["factorial"] = 0; }
  try { const v = (() => { Math.round( ( (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); })(n) ) / ( (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); })(r) * (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); })(n-r) ) * Math.pow(10, decimalPlaces) ) / Math.pow(10, decimalPlaces) })(); results["nCr"] = Number.isFinite(v) ? v : 0; } catch { results["nCr"] = 0; }
  try { const v = (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); })(n); results["nFact"] = Number.isFinite(v) ? v : 0; } catch { results["nFact"] = 0; }
  try { const v = (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); })(r); results["rFact"] = Number.isFinite(v) ? v : 0; } catch { results["rFact"] = 0; }
  try { const v = (function fact(x){ if(x <= 1) return 1; else return x * fact(x-1); })(n-r); results["nrFact"] = Number.isFinite(v) ? v : 0; } catch { results["nrFact"] = 0; }
  return results;
}


export function calculateNcr_calculator(input: Ncr_calculatorInput): Ncr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nCr"] ?? 0;
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


export interface Ncr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
