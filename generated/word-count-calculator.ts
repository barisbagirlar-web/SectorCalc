// Auto-generated from word-count-calculator-schema.json
import * as z from 'zod';

export interface Word_count_calculatorInput {
  totalCharacters: number;
  totalWordsManual: number;
  averageWordLength: number;
  readingSpeed: number;
  totalPages: number;
  wordsPerPage: number;
  dataConfidence?: number;
}

export const Word_count_calculatorInputSchema = z.object({
  totalCharacters: z.number().default(0),
  totalWordsManual: z.number().default(0),
  averageWordLength: z.number().default(5),
  readingSpeed: z.number().default(200),
  totalPages: z.number().default(0),
  wordsPerPage: z.number().default(275),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Word_count_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCharacters / input.averageWordLength; results["estimatedWordCountFromChars"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedWordCountFromChars"] = 0; }
  try { const v = input.totalPages * input.wordsPerPage; results["estimatedWordCountFromPages"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedWordCountFromPages"] = 0; }
  try { const v = input.totalWordsManual > 0 ? input.totalWordsManual : (input.totalPages > 0 ? input.totalPages * input.wordsPerPage : input.totalCharacters / input.averageWordLength); results["wordCount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wordCount"] = 0; }
  try { const v = (asFormulaNumber(results["wordCount"])) / input.readingSpeed; results["readingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["readingTimeMinutes"] = 0; }
  try { const v = input.totalCharacters; results["charactersCount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["charactersCount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWord_count_calculator(input: Word_count_calculatorInput): Word_count_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["wordCount"]));
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


export interface Word_count_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
