// Auto-generated from string-tension-calculator-schema.json
import * as z from 'zod';

export interface String_tension_calculatorInput {
  materialDensity: number;
  stringDiameter: number;
  stringLength: number;
  frequency: number;
}

export const String_tension_calculatorInputSchema = z.object({
  materialDensity: z.number().default(7850),
  stringDiameter: z.number().default(1),
  stringLength: z.number().default(65),
  frequency: z.number().default(440),
});

function evaluateAllFormulas(input: String_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialDensity * Math.PI * (input.stringDiameter / 1000) ** 2 / 4; results["linearDensity"] = Number.isFinite(v) ? v : 0; } catch { results["linearDensity"] = 0; }
  try { const v = input.stringLength / 100; results["lengthM"] = Number.isFinite(v) ? v : 0; } catch { results["lengthM"] = 0; }
  try { const v = (results["linearDensity"] ?? 0) * (2 * (results["lengthM"] ?? 0) * input.frequency) ** 2; results["tension"] = Number.isFinite(v) ? v : 0; } catch { results["tension"] = 0; }
  return results;
}


export function calculateString_tension_calculator(input: String_tension_calculatorInput): String_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tension"] ?? 0;
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


export interface String_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
