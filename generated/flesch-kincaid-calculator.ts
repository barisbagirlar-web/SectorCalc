// Auto-generated from flesch-kincaid-calculator-schema.json
import * as z from 'zod';

export interface Flesch_kincaid_calculatorInput {
  totalWords: number;
  totalSentences: number;
  totalSyllables: number;
  totalCharacters: number;
  dataConfidence?: number;
}

export const Flesch_kincaid_calculatorInputSchema = z.object({
  totalWords: z.number().default(0),
  totalSentences: z.number().default(0),
  totalSyllables: z.number().default(0),
  totalCharacters: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Flesch_kincaid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 206.835 - 1.015 * (input.totalWords / input.totalSentences) - 84.6 * (input.totalSyllables / input.totalWords); results["readingEaseScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["readingEaseScore"] = Number.NaN; }
  try { const v = 0.39 * (input.totalWords / input.totalSentences) + 11.8 * (input.totalSyllables / input.totalWords) - 15.59; results["gradeLevel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gradeLevel"] = Number.NaN; }
  try { const v = input.totalCharacters / input.totalWords; results["averageCharactersPerWord"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageCharactersPerWord"] = Number.NaN; }
  return results;
}


export function calculateFlesch_kincaid_calculator(input: Flesch_kincaid_calculatorInput): Flesch_kincaid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["readingEaseScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Flesch_kincaid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
