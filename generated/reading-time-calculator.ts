// Auto-generated from reading-time-calculator-schema.json
import * as z from 'zod';

export interface Reading_time_calculatorInput {
  wordCount: number;
  readingSpeed: number;
  complexityFactor: number;
  pageCount: number;
  pauseTimePerPage: number;
  dataConfidence?: number;
}

export const Reading_time_calculatorInputSchema = z.object({
  wordCount: z.number().default(1000),
  readingSpeed: z.number().default(200),
  complexityFactor: z.number().default(1),
  pageCount: z.number().default(10),
  pauseTimePerPage: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reading_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wordCount / input.readingSpeed; results["baseReadingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseReadingTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseReadingTimeMinutes"])) * input.complexityFactor; results["complexityAdjustedMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["complexityAdjustedMinutes"] = Number.NaN; }
  try { const v = (input.pageCount * input.pauseTimePerPage) / 60; results["pauseAdditionalMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pauseAdditionalMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["complexityAdjustedMinutes"])) + (toNumericFormulaValue(results["pauseAdditionalMinutes"])); results["totalReadingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalReadingTimeMinutes"] = Number.NaN; }
  return results;
}


export function calculateReading_time_calculator(input: Reading_time_calculatorInput): Reading_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalReadingTimeMinutes"]);
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


export interface Reading_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
