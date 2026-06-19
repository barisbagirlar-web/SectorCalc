// Auto-generated from note-frequency-calculator-schema.json
import * as z from 'zod';

export interface Note_frequency_calculatorInput {
  referenceFrequency: number;
  referenceNote: number;
  targetNote: number;
  centsAdjustment: number;
  dataConfidence?: number;
}

export const Note_frequency_calculatorInputSchema = z.object({
  referenceFrequency: z.number().default(440),
  referenceNote: z.number().default(69),
  targetNote: z.number().default(69),
  centsAdjustment: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Note_frequency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.targetNote - input.referenceNote; results["semitoneOffset"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["semitoneOffset"] = 0; }
  try { const v = input.targetNote - input.referenceNote; results["semitoneOffset_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["semitoneOffset_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNote_frequency_calculator(input: Note_frequency_calculatorInput): Note_frequency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["semitoneOffset_aux"]));
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


export interface Note_frequency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
