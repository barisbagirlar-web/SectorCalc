// Auto-generated from bass-string-calculator-schema.json
import * as z from 'zod';

export interface Bass_string_calculatorInput {
  scaleLength: number;
  unitWeight: number;
  frequency: number;
}

export const Bass_string_calculatorInputSchema = z.object({
  scaleLength: z.number().default(34),
  unitWeight: z.number().default(0.00245),
  frequency: z.number().default(41.2),
});

function evaluateAllFormulas(input: Bass_string_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(2 * input.scaleLength * input.frequency, 2) * input.unitWeight / 386.4; results["tensionLBF"] = Number.isFinite(v) ? v : 0; } catch { results["tensionLBF"] = 0; }
  try { const v = (results["tensionLBF"] ?? 0) * 4.44822; results["tensionN"] = Number.isFinite(v) ? v : 0; } catch { results["tensionN"] = 0; }
  try { const v = input.scaleLength * 0.0254; results["scaleLengthM"] = Number.isFinite(v) ? v : 0; } catch { results["scaleLengthM"] = 0; }
  try { const v = input.unitWeight * 17.858; results["unitWeightKGperM"] = Number.isFinite(v) ? v : 0; } catch { results["unitWeightKGperM"] = 0; }
  return results;
}


export function calculateBass_string_calculator(input: Bass_string_calculatorInput): Bass_string_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tensionLBF"] ?? 0;
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


export interface Bass_string_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
