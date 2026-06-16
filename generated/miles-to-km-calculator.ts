// Auto-generated from miles-to-km-calculator-schema.json
import * as z from 'zod';

export interface Miles_to_km_calculatorInput {
  miles: number;
  precision: number;
  isNautical: number;
  conversionFactorStatute: number;
  conversionFactorNautical: number;
}

export const Miles_to_km_calculatorInputSchema = z.object({
  miles: z.number().default(1),
  precision: z.number().default(2),
  isNautical: z.number().default(0),
  conversionFactorStatute: z.number().default(1.60934),
  conversionFactorNautical: z.number().default(1.852),
});

function evaluateAllFormulas(input: Miles_to_km_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Number(((input.isNautical === 1 ? input.miles * input.conversionFactorNautical : input.miles * input.conversionFactorStatute)).toFixed(input.precision)); results["kilometers"] = Number.isFinite(v) ? v : 0; } catch { results["kilometers"] = 0; }
  try { const v = input.isNautical === 1 ? input.miles * input.conversionFactorNautical : input.miles * input.conversionFactorStatute; results["kilometersRaw"] = Number.isFinite(v) ? v : 0; } catch { results["kilometersRaw"] = 0; }
  try { const v = `Converted using factor ${input.isNautical === 1 ? input.conversionFactorNautical : input.conversionFactorStatute} km/mi`; results["conversionMessage"] = Number.isFinite(v) ? v : 0; } catch { results["conversionMessage"] = 0; }
  return results;
}


export function calculateMiles_to_km_calculator(input: Miles_to_km_calculatorInput): Miles_to_km_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["kilometers"] ?? 0;
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


export interface Miles_to_km_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
