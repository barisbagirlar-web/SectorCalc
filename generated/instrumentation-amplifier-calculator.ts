// Auto-generated from instrumentation-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Instrumentation_amplifier_calculatorInput {
  r1: number;
  r2: number;
  vinPlus: number;
  vinMinus: number;
  vref: number;
}

export const Instrumentation_amplifier_calculatorInputSchema = z.object({
  r1: z.number().default(1000),
  r2: z.number().default(10000),
  vinPlus: z.number().default(0.01),
  vinMinus: z.number().default(0),
  vref: z.number().default(0),
});

function evaluateAllFormulas(input: Instrumentation_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + 2 * input.r2 / input.r1; results["gain"] = Number.isFinite(v) ? v : 0; } catch { results["gain"] = 0; }
  try { const v = input.vinPlus - input.vinMinus; results["vd"] = Number.isFinite(v) ? v : 0; } catch { results["vd"] = 0; }
  try { const v = (1 + 2 * input.r2 / input.r1) * (input.vinPlus - input.vinMinus) + input.vref; results["vout"] = Number.isFinite(v) ? v : 0; } catch { results["vout"] = 0; }
  return results;
}


export function calculateInstrumentation_amplifier_calculator(input: Instrumentation_amplifier_calculatorInput): Instrumentation_amplifier_calculatorOutput {
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


export interface Instrumentation_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
