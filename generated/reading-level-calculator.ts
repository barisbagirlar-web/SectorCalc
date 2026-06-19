// Auto-generated from reading-level-calculator-schema.json
import * as z from 'zod';

export interface Reading_level_calculatorInput {
  totalWords: number;
  totalSentences: number;
  totalSyllables: number;
  totalComplexWords: number;
  dataConfidence?: number;
}

export const Reading_level_calculatorInputSchema = z.object({
  totalWords: z.number().default(100),
  totalSentences: z.number().default(10),
  totalSyllables: z.number().default(150),
  totalComplexWords: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reading_level_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.39 * (input.totalWords / input.totalSentences) + 11.8 * (input.totalSyllables / input.totalWords) - 15.59; results["readingGradeLevel"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["readingGradeLevel"] = 0; }
  try { const v = 206.835 - 1.015 * (input.totalWords / input.totalSentences) - 84.6 * (input.totalSyllables / input.totalWords); results["readingEase"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["readingEase"] = 0; }
  try { const v = 0.4 * ((input.totalWords / input.totalSentences) + 100 * (input.totalComplexWords / input.totalWords)); results["gunningFog"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gunningFog"] = 0; }
  try { const v = 206.835 - 1.015 * (input.totalWords / input.totalSentences) - 84.6 * (input.totalSyllables / input.totalWords); results["206_835___1_015____totalWords___totalSen"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["206_835___1_015____totalWords___totalSen"] = 0; }
  try { const v = 0.4 * ((input.totalWords / input.totalSentences) + 100 * (input.totalComplexWords / input.totalWords)); results["0_4_____totalWords___totalSentences____1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["0_4_____totalWords___totalSentences____1"] = 0; }
  try { const v = 0.39 * (input.totalWords / input.totalSentences) + 11.8 * (input.totalSyllables / input.totalWords) - 15.59; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReading_level_calculator(input: Reading_level_calculatorInput): Reading_level_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
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


export interface Reading_level_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
