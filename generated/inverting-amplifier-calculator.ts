// Auto-generated from inverting-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Inverting_amplifier_calculatorInput {
  vin: number;
  rin: number;
  rf: number;
  vcc_plus: number;
  vcc_minus: number;
}

export const Inverting_amplifier_calculatorInputSchema = z.object({
  vin: z.number().default(1),
  rin: z.number().default(1000),
  rf: z.number().default(10000),
  vcc_plus: z.number().default(15),
  vcc_minus: z.number().default(-15),
});

function evaluateAllFormulas(input: Inverting_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.rf/input.rin); results["gain"] = Number.isFinite(v) ? v : 0; } catch { results["gain"] = 0; }
  try { const v = -(input.rf/input.rin)*input.vin; results["vout_ideal"] = Number.isFinite(v) ? v : 0; } catch { results["vout_ideal"] = 0; }
  try { const v = Math.min(input.vcc_plus, Math.max(input.vcc_minus, -(input.rf/input.rin)*input.vin)); results["vout"] = Number.isFinite(v) ? v : 0; } catch { results["vout"] = 0; }
  return results;
}


export function calculateInverting_amplifier_calculator(input: Inverting_amplifier_calculatorInput): Inverting_amplifier_calculatorOutput {
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


export interface Inverting_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
