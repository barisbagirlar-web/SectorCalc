// Auto-generated from mandolin-string-tension-calculator-schema.json
import * as z from 'zod';

export interface Mandolin_string_tension_calculatorInput {
  scaleLength: number;
  stringDiameter: number;
  materialDensity: number;
  noteFrequency: number;
}

export const Mandolin_string_tension_calculatorInputSchema = z.object({
  scaleLength: z.number().default(330),
  stringDiameter: z.number().default(0.25),
  materialDensity: z.number().default(7800),
  noteFrequency: z.number().default(196),
});

function evaluateAllFormulas(input: Mandolin_string_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialDensity * Math.PI * Math.pow((input.stringDiameter / 1000) / 2, 2); results["linearDensity"] = Number.isFinite(v) ? v : 0; } catch { results["linearDensity"] = 0; }
  try { const v = input.materialDensity * Math.PI * Math.pow((input.stringDiameter / 1000) / 2, 2) * Math.pow(2 * (input.scaleLength / 1000) * input.noteFrequency, 2); results["tension"] = Number.isFinite(v) ? v : 0; } catch { results["tension"] = 0; }
  try { const v = input.materialDensity * Math.PI * Math.pow((input.stringDiameter / 1000) / 2, 2); results["materialDensity___Math_PI___Math_pow__st"] = Number.isFinite(v) ? v : 0; } catch { results["materialDensity___Math_PI___Math_pow__st"] = 0; }
  try { const v = 2 * (input.scaleLength / 1000) * input.noteFrequency; results["2____scaleLength___1000____noteFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["2____scaleLength___1000____noteFrequency"] = 0; }
  try { const v = Math.pow(2 * (input.scaleLength / 1000) * input.noteFrequency, 2); results["Math_pow_2____scaleLength___1000____note"] = Number.isFinite(v) ? v : 0; } catch { results["Math_pow_2____scaleLength___1000____note"] = 0; }
  try { const v = input.materialDensity * Math.PI * Math.pow((input.stringDiameter / 1000) / 2, 2) * Math.pow(2 * (input.scaleLength / 1000) * input.noteFrequency, 2); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateMandolin_string_tension_calculator(input: Mandolin_string_tension_calculatorInput): Mandolin_string_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Mandolin_string_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
