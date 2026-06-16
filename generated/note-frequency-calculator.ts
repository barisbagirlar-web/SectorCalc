// Auto-generated from note-frequency-calculator-schema.json
import * as z from 'zod';

export interface Note_frequency_calculatorInput {
  referenceFrequency: number;
  referenceNote: number;
  targetNote: number;
  centsAdjustment: number;
}

export const Note_frequency_calculatorInputSchema = z.object({
  referenceFrequency: z.number().default(440),
  referenceNote: z.number().default(69),
  targetNote: z.number().default(69),
  centsAdjustment: z.number().default(0),
});

function evaluateAllFormulas(input: Note_frequency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.targetNote - input.referenceNote; results["semitoneOffset"] = Number.isFinite(v) ? v : 0; } catch { results["semitoneOffset"] = 0; }
  try { const v = input.referenceFrequency * Math.pow(2, (input.targetNote - input.referenceNote) / 12); results["frequencyWithoutCents"] = Number.isFinite(v) ? v : 0; } catch { results["frequencyWithoutCents"] = 0; }
  try { const v = input.referenceFrequency * Math.pow(2, (input.targetNote - input.referenceNote + input.centsAdjustment / 100) / 12); results["frequency"] = Number.isFinite(v) ? v : 0; } catch { results["frequency"] = 0; }
  return results;
}


export function calculateNote_frequency_calculator(input: Note_frequency_calculatorInput): Note_frequency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["frequency"] ?? 0;
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


export interface Note_frequency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
