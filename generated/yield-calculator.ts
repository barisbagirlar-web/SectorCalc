// Auto-generated from yield-calculator-schema.json
import * as z from 'zod';

export interface Yield_calculatorInput {
  totalUnits: number;
  goodUnitsFirstPass: number;
  reworkedUnits: number;
  scrapUnits: number;
  dataConfidence?: number;
}

export const Yield_calculatorInputSchema = z.object({
  totalUnits: z.number().default(1000),
  goodUnitsFirstPass: z.number().default(850),
  reworkedUnits: z.number().default(100),
  scrapUnits: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.goodUnitsFirstPass + input.reworkedUnits) / input.totalUnits * 100; results["overallYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallYield"] = Number.NaN; }
  try { const v = input.goodUnitsFirstPass / input.totalUnits * 100; results["firstPassYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["firstPassYield"] = Number.NaN; }
  try { const v = input.reworkedUnits / input.totalUnits * 100; results["reworkRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reworkRate"] = Number.NaN; }
  try { const v = input.scrapUnits / input.totalUnits * 100; results["scrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapRate"] = Number.NaN; }
  return results;
}


export function calculateYield_calculator(input: Yield_calculatorInput): Yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallYield"]);
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


export interface Yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
