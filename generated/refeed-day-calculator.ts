// Auto-generated from refeed-day-calculator-schema.json
import * as z from 'zod';

export interface Refeed_day_calculatorInput {
  productionRate: number;
  scrapRate: number;
  refeedTargetRatio: number;
  refeedMaterialAvailability: number;
  maxRefeedCapacity: number;
  dataConfidence?: number;
}

export const Refeed_day_calculatorInputSchema = z.object({
  productionRate: z.number().default(1000),
  scrapRate: z.number().default(5),
  refeedTargetRatio: z.number().default(10),
  refeedMaterialAvailability: z.number().default(500),
  maxRefeedCapacity: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Refeed_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionRate * (input.scrapRate / 100); results["scrapPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scrapPerDay"] = 0; }
  try { const v = input.productionRate + (asFormulaNumber(results["scrapPerDay"])); results["totalInputPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInputPerDay"] = 0; }
  try { const v = (asFormulaNumber(results["totalInputPerDay"])) * (input.refeedTargetRatio / 100); results["dailyRefeedTarget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyRefeedTarget"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRefeed_day_calculator(input: Refeed_day_calculatorInput): Refeed_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dailyRefeedTarget"]));
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


export interface Refeed_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
