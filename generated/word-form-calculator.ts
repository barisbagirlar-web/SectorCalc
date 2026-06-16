// Auto-generated from word-form-calculator-schema.json
import * as z from 'zod';

export interface Word_form_calculatorInput {
  totalWords: number;
  totalSentences: number;
  totalSyllables: number;
  complexWords: number;
}

export const Word_form_calculatorInputSchema = z.object({
  totalWords: z.number().default(100),
  totalSentences: z.number().default(10),
  totalSyllables: z.number().default(150),
  complexWords: z.number().default(20),
});

function evaluateAllFormulas(input: Word_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWords / input.totalSentences; results["wordsPerSentence"] = Number.isFinite(v) ? v : 0; } catch { results["wordsPerSentence"] = 0; }
  try { const v = input.totalSyllables / input.totalWords; results["syllablesPerWord"] = Number.isFinite(v) ? v : 0; } catch { results["syllablesPerWord"] = 0; }
  try { const v = 206.835 - 1.015 * (input.totalWords / input.totalSentences) - 84.6 * (input.totalSyllables / input.totalWords); results["fleschReadingEase"] = Number.isFinite(v) ? v : 0; } catch { results["fleschReadingEase"] = 0; }
  try { const v = 0.39 * (input.totalWords / input.totalSentences) + 11.8 * (input.totalSyllables / input.totalWords) - 15.59; results["fleschKincaidGrade"] = Number.isFinite(v) ? v : 0; } catch { results["fleschKincaidGrade"] = 0; }
  try { const v = (input.complexWords / input.totalWords) * 100; results["percentComplexWords"] = Number.isFinite(v) ? v : 0; } catch { results["percentComplexWords"] = 0; }
  return results;
}


export function calculateWord_form_calculator(input: Word_form_calculatorInput): Word_form_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fleschReadingEase"] ?? 0;
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


export interface Word_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
