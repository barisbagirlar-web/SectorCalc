// Auto-generated from non-inverting-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Non_inverting_amplifier_calculatorInput {
  vin: number;
  r1: number;
  r2: number;
  vcc: number;
  vee: number;
  headroom: number;
}

export const Non_inverting_amplifier_calculatorInputSchema = z.object({
  vin: z.number().default(1),
  r1: z.number().default(10000),
  r2: z.number().default(10000),
  vcc: z.number().default(15),
  vee: z.number().default(-15),
  headroom: z.number().default(1.5),
});

function evaluateAllFormulas(input: Non_inverting_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + input.r2 / input.r1; results["gain"] = Number.isFinite(v) ? v : 0; } catch { results["gain"] = 0; }
  try { const v = input.vin * (1 + input.r2 / input.r1); results["vout_ideal"] = Number.isFinite(v) ? v : 0; } catch { results["vout_ideal"] = 0; }
  try { const v = input.vcc - input.headroom; results["vhigh"] = Number.isFinite(v) ? v : 0; } catch { results["vhigh"] = 0; }
  try { const v = input.vee + input.headroom; results["vlow"] = Number.isFinite(v) ? v : 0; } catch { results["vlow"] = 0; }
  try { const v = Math.max((results["vlow"] ?? 0), Math.min((results["vout_ideal"] ?? 0), (results["vhigh"] ?? 0))); results["vout_actual"] = Number.isFinite(v) ? v : 0; } catch { results["vout_actual"] = 0; }
  try { const v = ((results["vout_ideal"] ?? 0) > (results["vhigh"] ?? 0) || (results["vout_ideal"] ?? 0) < (results["vlow"] ?? 0)) ? 1 : 0; results["is_clipping"] = Number.isFinite(v) ? v : 0; } catch { results["is_clipping"] = 0; }
  return results;
}


export function calculateNon_inverting_amplifier_calculator(input: Non_inverting_amplifier_calculatorInput): Non_inverting_amplifier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vout_actual"] ?? 0;
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


export interface Non_inverting_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
