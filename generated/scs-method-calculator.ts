// Auto-generated from scs-method-calculator-schema.json
import * as z from 'zod';

export interface Scs_method_calculatorInput {
  rainfall: number;
  curveNumber: number;
  amc: number;
  iaRatio: number;
}

export const Scs_method_calculatorInputSchema = z.object({
  rainfall: z.number().default(50),
  curveNumber: z.number().default(75),
  amc: z.number().default(2),
  iaRatio: z.number().default(0.2),
});

function evaluateAllFormulas(input: Scs_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(100, Math.max(0, input.amc === 1 ? input.curveNumber / (2.334 - 0.01334 * input.curveNumber) : input.amc === 3 ? input.curveNumber / (0.4036 + 0.0059 * input.curveNumber) : input.curveNumber)); results["adjustedCN"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedCN"] = 0; }
  try { const v = (25400 / (results["adjustedCN"] ?? 0)) - 254; results["S"] = Number.isFinite(v) ? v : 0; } catch { results["S"] = 0; }
  try { const v = input.iaRatio * (results["S"] ?? 0); results["Ia"] = Number.isFinite(v) ? v : 0; } catch { results["Ia"] = 0; }
  try { const v = input.rainfall > (results["Ia"] ?? 0) ? Math.pow(input.rainfall - (results["Ia"] ?? 0), 2) / (input.rainfall - (results["Ia"] ?? 0) + (results["S"] ?? 0)) : 0; results["runoff"] = Number.isFinite(v) ? v : 0; } catch { results["runoff"] = 0; }
  return results;
}


export function calculateScs_method_calculator(input: Scs_method_calculatorInput): Scs_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["runoff"] ?? 0;
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


export interface Scs_method_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
