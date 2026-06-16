// Auto-generated from decay-constant-calculator-schema.json
import * as z from 'zod';

export interface Decay_constant_calculatorInput {
  halfLife: number;
  meanLifetime: number;
  initialQuantity: number;
  finalQuantity: number;
  timeElapsed: number;
  timeUnitConversion: number;
}

export const Decay_constant_calculatorInputSchema = z.object({
  halfLife: z.number().default(0),
  meanLifetime: z.number().default(0),
  initialQuantity: z.number().default(0),
  finalQuantity: z.number().default(0),
  timeElapsed: z.number().default(0),
  timeUnitConversion: z.number().default(1),
});

function evaluateAllFormulas(input: Decay_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.halfLife > 0 ? Math.log(2) / input.halfLife : (input.meanLifetime > 0 ? 1 / input.meanLifetime : (input.initialQuantity > 0 && input.finalQuantity > 0 && input.timeElapsed > 0 ? -Math.log(input.finalQuantity / input.initialQuantity) / input.timeElapsed : 0))); results["lambdaRaw"] = Number.isFinite(v) ? v : 0; } catch { results["lambdaRaw"] = 0; }
  try { const v = (results["lambdaRaw"] ?? 0) * input.timeUnitConversion; results["decayConstant"] = Number.isFinite(v) ? v : 0; } catch { results["decayConstant"] = 0; }
  try { const v = input.halfLife > 0 ? Math.log(2) / input.halfLife * input.timeUnitConversion : null; results["halfLifeBased"] = Number.isFinite(v) ? v : 0; } catch { results["halfLifeBased"] = 0; }
  try { const v = input.meanLifetime > 0 ? 1 / input.meanLifetime * input.timeUnitConversion : null; results["meanLifetimeBased"] = Number.isFinite(v) ? v : 0; } catch { results["meanLifetimeBased"] = 0; }
  try { const v = input.initialQuantity > 0 && input.finalQuantity > 0 && input.timeElapsed > 0 ? -Math.log(input.finalQuantity / input.initialQuantity) / input.timeElapsed * input.timeUnitConversion : null; results["quantityBased"] = Number.isFinite(v) ? v : 0; } catch { results["quantityBased"] = 0; }
  return results;
}


export function calculateDecay_constant_calculator(input: Decay_constant_calculatorInput): Decay_constant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["decayConstant"] ?? 0;
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


export interface Decay_constant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
