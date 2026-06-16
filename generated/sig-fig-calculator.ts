// Auto-generated from sig-fig-calculator-schema.json
import * as z from 'zod';

export interface Sig_fig_calculatorInput {
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  operation: number;
}

export const Sig_fig_calculatorInputSchema = z.object({
  num1: z.number().default(0),
  num2: z.number().default(0),
  num3: z.number().default(0),
  num4: z.number().default(0),
  operation: z.number().default(1),
});

function evaluateAllFormulas(input: Sig_fig_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operation == 1 ? (input.num1 + input.num2 + input.num3 + input.num4) : (input.num1 * input.num2 * input.num3 * input.num4); results["rawResult"] = Number.isFinite(v) ? v : 0; } catch { results["rawResult"] = 0; }
  try { const v = input.operation == 1 ? Math.min(input.num1.toString().split('.')[1] ? input.num1.toString().split('.')[1].length : 0, input.num2.toString().split('.')[1] ? input.num2.toString().split('.')[1].length : 0, input.num3.toString().split('.')[1] ? input.num3.toString().split('.')[1].length : 0, input.num4.toString().split('.')[1] ? input.num4.toString().split('.')[1].length : 0) : 0; results["minDecimalPlaces"] = Number.isFinite(v) ? v : 0; } catch { results["minDecimalPlaces"] = 0; }
  try { const v = (() => { operation == 2 ? (function(){ function sigFigs(n) { if (n == 0) return 1; n = Math.abs(n); var str = n.toExponential(); var mantissa = str.split('e')[0].replace(/\./g, '').replace(/^0+/, ''); return mantissa.length; } return Math.min(sigFigs(num1), sigFigs(num2), sigFigs(num3), sigFigs(num4)); })() : 0 })(); results["minSigFigs"] = Number.isFinite(v) ? v : 0; } catch { results["minSigFigs"] = 0; }
  try { const v = (() => { input.operation == 1 ? Math.round(rawResult * Math.pow(10, minDecimalPlaces)) / Math.pow(10, minDecimalPlaces) : (function() { if (rawResult == 0) return 0; var r = Math.abs(rawResult); var factor = Math.pow(10, minSigFigs - 1 - Math.floor(Math.log10(r))); return Math.round(rawResult * factor) / factor; })() })(); results["roundedResult"] = Number.isFinite(v) ? v : 0; } catch { results["roundedResult"] = 0; }
  return results;
}


export function calculateSig_fig_calculator(input: Sig_fig_calculatorInput): Sig_fig_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedResult"] ?? 0;
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


export interface Sig_fig_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
