// @ts-nocheck
// Auto-generated from graph-coloring-calculator-schema.json
import * as z from 'zod';

export interface Graph_coloring_calculatorInput {
  measurement: number;
  target: number;
  lowerSpec: number;
  upperSpec: number;
  warningFraction: number;
}

export const Graph_coloring_calculatorInputSchema = z.object({
  measurement: z.number().default(10),
  target: z.number().default(10),
  lowerSpec: z.number().default(8),
  upperSpec: z.number().default(12),
  warningFraction: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Graph_coloring_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.upperSpec - input.lowerSpec) / 2; results["specHalfRange"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["specHalfRange"] = 0; }
  try { const v = (asFormulaNumber(results["specHalfRange"])) * input.warningFraction; results["warningHalfWidth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["warningHalfWidth"] = 0; }
  try { const v = (input.measurement >= input.lowerSpec && input.measurement <= input.upperSpec) ? 1 : 0; results["isWithinSpec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["isWithinSpec"] = 0; }
  try { const v = (input.measurement >= input.target - (asFormulaNumber(results["warningHalfWidth"])) && input.measurement <= input.target + (asFormulaNumber(results["warningHalfWidth"]))) ? 1 : 0; results["isGood"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["isGood"] = 0; }
  try { const v = (asFormulaNumber(results["isWithinSpec"])) ? ((asFormulaNumber(results["isGood"])) ? 2 : 1) : 0; results["colorCode"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["colorCode"] = 0; }
  try { const v = input.measurement - input.target; results["deviation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deviation"] = 0; }
  try { const v = ((input.measurement - input.target) / (asFormulaNumber(results["specHalfRange"]))) * 100; results["percentDeviation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["percentDeviation"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGraph_coloring_calculator(input: Graph_coloring_calculatorInput): Graph_coloring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["colorCode"]);
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


export interface Graph_coloring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
