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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Refeed_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionRate * (input.scrapRate / 100); results["scrapPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapPerDay"] = Number.NaN; }
  try { const v = input.productionRate + (toNumericFormulaValue(results["scrapPerDay"])); results["totalInputPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInputPerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInputPerDay"])) * (input.refeedTargetRatio / 100); results["dailyRefeedTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyRefeedTarget"] = Number.NaN; }
  return results;
}


export function calculateRefeed_day_calculator(input: Refeed_day_calculatorInput): Refeed_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyRefeedTarget"]);
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


export interface Refeed_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
