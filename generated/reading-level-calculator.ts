// Auto-generated from reading-level-calculator-schema.json
import * as z from 'zod';

export interface Reading_level_calculatorInput {
  totalWords: number;
  totalSentences: number;
  totalSyllables: number;
  totalComplexWords: number;
}

export const Reading_level_calculatorInputSchema = z.object({
  totalWords: z.number().default(100),
  totalSentences: z.number().default(10),
  totalSyllables: z.number().default(150),
  totalComplexWords: z.number().default(20),
});

function evaluateAllFormulas(input: Reading_level_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.39 * (input.totalWords / input.totalSentences) + 11.8 * (input.totalSyllables / input.totalWords) - 15.59; results["readingGradeLevel"] = Number.isFinite(v) ? v : 0; } catch { results["readingGradeLevel"] = 0; }
  try { const v = 206.835 - 1.015 * (input.totalWords / input.totalSentences) - 84.6 * (input.totalSyllables / input.totalWords); results["readingEase"] = Number.isFinite(v) ? v : 0; } catch { results["readingEase"] = 0; }
  try { const v = 0.4 * ((input.totalWords / input.totalSentences) + 100 * (input.totalComplexWords / input.totalWords)); results["gunningFog"] = Number.isFinite(v) ? v : 0; } catch { results["gunningFog"] = 0; }
  return results;
}


export function calculateReading_level_calculator(input: Reading_level_calculatorInput): Reading_level_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["0"] ?? 0;
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


export interface Reading_level_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
