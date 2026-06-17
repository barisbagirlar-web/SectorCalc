// @ts-nocheck
// Auto-generated from yield-calculator-schema.json
import * as z from 'zod';

export interface Yield_calculatorInput {
  totalUnits: number;
  goodUnitsFirstPass: number;
  reworkedUnits: number;
  scrapUnits: number;
}

export const Yield_calculatorInputSchema = z.object({
  totalUnits: z.number().default(1000),
  goodUnitsFirstPass: z.number().default(850),
  reworkedUnits: z.number().default(100),
  scrapUnits: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Yield_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.goodUnitsFirstPass + input.reworkedUnits) / input.totalUnits * 100; results["overallYield"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallYield"] = 0; }
  try { const v = input.goodUnitsFirstPass / input.totalUnits * 100; results["firstPassYield"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["firstPassYield"] = 0; }
  try { const v = input.reworkedUnits / input.totalUnits * 100; results["reworkRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reworkRate"] = 0; }
  try { const v = input.scrapUnits / input.totalUnits * 100; results["scrapRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["scrapRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateYield_calculator(input: Yield_calculatorInput): Yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallYield"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
