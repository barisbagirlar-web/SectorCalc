// Auto-generated from page-count-calculator-schema.json
import * as z from 'zod';

export interface Page_count_calculatorInput {
  totalWords: number;
  wordsPerPage: number;
  imagesFullPage: number;
  imagesHalfPage: number;
  tablesFullPage: number;
  tablesHalfPage: number;
  dataConfidence?: number;
}

export const Page_count_calculatorInputSchema = z.object({
  totalWords: z.number().default(2000),
  wordsPerPage: z.number().default(250),
  imagesFullPage: z.number().default(0),
  imagesHalfPage: z.number().default(0),
  tablesFullPage: z.number().default(0),
  tablesHalfPage: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Page_count_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWords / input.wordsPerPage; results["textPages"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["textPages"] = Number.NaN; }
  try { const v = input.imagesFullPage + 0.5 * input.imagesHalfPage; results["imagePages"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["imagePages"] = Number.NaN; }
  try { const v = input.tablesFullPage + 0.5 * input.tablesHalfPage; results["tablePages"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tablePages"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["textPages"])) + (toNumericFormulaValue(results["imagePages"])) + (toNumericFormulaValue(results["tablePages"])); results["totalEstimatedPages"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEstimatedPages"] = Number.NaN; }
  return results;
}


export function calculatePage_count_calculator(input: Page_count_calculatorInput): Page_count_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEstimatedPages"]);
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


export interface Page_count_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
