// Auto-generated from tebibytes-to-terabytes-calculator-schema.json
import * as z from 'zod';

export interface Tebibytes_to_terabytes_calculatorInput {
  tebibytes: number;
  conversionFactor: number;
  precision: number;
  outputMultiplier: number;
}

export const Tebibytes_to_terabytes_calculatorInputSchema = z.object({
  tebibytes: z.number().default(1),
  conversionFactor: z.number().default(1.099511627776),
  precision: z.number().default(2),
  outputMultiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Tebibytes_to_terabytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = parseFloat(((input.tebibytes * input.conversionFactor * input.outputMultiplier).toFixed(input.precision))); results["terabytes"] = Number.isFinite(v) ? v : 0; } catch { results["terabytes"] = 0; }
  try { const v = "1 TiB = " + input.conversionFactor + " TB"; results["conversionEquation"] = Number.isFinite(v) ? v : 0; } catch { results["conversionEquation"] = 0; }
  try { const v = input.tebibytes * input.conversionFactor; results["rawValueWithoutMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["rawValueWithoutMultiplier"] = 0; }
  return results;
}


export function calculateTebibytes_to_terabytes_calculator(input: Tebibytes_to_terabytes_calculatorInput): Tebibytes_to_terabytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["terabytes"] ?? 0;
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


export interface Tebibytes_to_terabytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
