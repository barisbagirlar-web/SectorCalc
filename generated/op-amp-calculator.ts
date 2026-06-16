// Auto-generated from op-amp-calculator-schema.json
import * as z from 'zod';

export interface Op_amp_calculatorInput {
  vin: number;
  rin: number;
  rf: number;
  vcc: number;
  vee: number;
}

export const Op_amp_calculatorInputSchema = z.object({
  vin: z.number().default(1),
  rin: z.number().default(1000),
  rf: z.number().default(1000),
  vcc: z.number().default(12),
  vee: z.number().default(0),
});

function evaluateAllFormulas(input: Op_amp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (input.rf / input.rin); results["gain"] = Number.isFinite(v) ? v : 0; } catch { results["gain"] = 0; }
  try { const v = input.vin * (1 + (input.rf / input.rin)); results["vout_ideal"] = Number.isFinite(v) ? v : 0; } catch { results["vout_ideal"] = 0; }
  try { const v = Math.min(input.vcc - 1.5, Math.max(input.vee + 0.5, input.vin * (1 + input.rf / input.rin))); results["vout"] = Number.isFinite(v) ? v : 0; } catch { results["vout"] = 0; }
  return results;
}


export function calculateOp_amp_calculator(input: Op_amp_calculatorInput): Op_amp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vout"] ?? 0;
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


export interface Op_amp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
