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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Page_count_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWords / input.wordsPerPage; results["textPages"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["textPages"] = 0; }
  try { const v = input.imagesFullPage + 0.5 * input.imagesHalfPage; results["imagePages"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["imagePages"] = 0; }
  try { const v = input.tablesFullPage + 0.5 * input.tablesHalfPage; results["tablePages"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tablePages"] = 0; }
  try { const v = (asFormulaNumber(results["textPages"])) + (asFormulaNumber(results["imagePages"])) + (asFormulaNumber(results["tablePages"])); results["totalEstimatedPages"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEstimatedPages"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePage_count_calculator(input: Page_count_calculatorInput): Page_count_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalEstimatedPages"]));
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


export interface Page_count_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
