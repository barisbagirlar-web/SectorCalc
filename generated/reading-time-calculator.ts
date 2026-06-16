// Auto-generated from reading-time-calculator-schema.json
import * as z from 'zod';

export interface Reading_time_calculatorInput {
  wordCount: number;
  readingSpeed: number;
  complexityFactor: number;
  pageCount: number;
  pauseTimePerPage: number;
}

export const Reading_time_calculatorInputSchema = z.object({
  wordCount: z.number().default(1000),
  readingSpeed: z.number().default(200),
  complexityFactor: z.number().default(1),
  pageCount: z.number().default(10),
  pauseTimePerPage: z.number().default(15),
});

function evaluateAllFormulas(input: Reading_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wordCount / input.readingSpeed; results["baseReadingTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["baseReadingTimeMinutes"] = 0; }
  try { const v = (results["baseReadingTimeMinutes"] ?? 0) * input.complexityFactor; results["complexityAdjustedMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["complexityAdjustedMinutes"] = 0; }
  try { const v = (input.pageCount * input.pauseTimePerPage) / 60; results["pauseAdditionalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["pauseAdditionalMinutes"] = 0; }
  try { const v = (results["complexityAdjustedMinutes"] ?? 0) + (results["pauseAdditionalMinutes"] ?? 0); results["totalReadingTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalReadingTimeMinutes"] = 0; }
  return results;
}


export function calculateReading_time_calculator(input: Reading_time_calculatorInput): Reading_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalReadingTimeMinutes"] ?? 0;
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


export interface Reading_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
