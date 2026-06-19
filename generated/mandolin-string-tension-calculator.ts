// Auto-generated from mandolin-string-tension-calculator-schema.json
import * as z from 'zod';

export interface Mandolin_string_tension_calculatorInput {
  scaleLength: number;
  stringDiameter: number;
  materialDensity: number;
  noteFrequency: number;
  dataConfidence?: number;
}

export const Mandolin_string_tension_calculatorInputSchema = z.object({
  scaleLength: z.number().default(330),
  stringDiameter: z.number().default(0.25),
  materialDensity: z.number().default(7800),
  noteFrequency: z.number().default(196),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mandolin_string_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.scaleLength / 1000) * input.noteFrequency; results["2____scaleLength___1000____noteFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["2____scaleLength___1000____noteFrequency"] = 0; }
  try { const v = 2 * (input.scaleLength / 1000) * input.noteFrequency; results["2____scaleLength___1000____noteFrequency_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["2____scaleLength___1000____noteFrequency_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMandolin_string_tension_calculator(input: Mandolin_string_tension_calculatorInput): Mandolin_string_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["2____scaleLength___1000____noteFrequency_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
