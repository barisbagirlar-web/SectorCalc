// @ts-nocheck
// Auto-generated from two-way-anova-calculator-schema.json
import * as z from 'zod';

export interface Two_way_anova_calculatorInput {
  SSA: number;
  SSB: number;
  SSAB: number;
  SSE: number;
  dfA: number;
  dfB: number;
  dfAB: number;
  dfE: number;
}

export const Two_way_anova_calculatorInputSchema = z.object({
  SSA: z.number().default(0),
  SSB: z.number().default(0),
  SSAB: z.number().default(0),
  SSE: z.number().default(0),
  dfA: z.number().default(1),
  dfB: z.number().default(1),
  dfAB: z.number().default(1),
  dfE: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Two_way_anova_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.SSA / input.dfA; results["MSA"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["MSA"] = 0; }
  try { const v = input.SSB / input.dfB; results["MSB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["MSB"] = 0; }
  try { const v = input.SSAB / input.dfAB; results["MSAB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["MSAB"] = 0; }
  try { const v = input.SSE / input.dfE; results["MSE"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["MSE"] = 0; }
  try { const v = (asFormulaNumber(results["MSA"])) / (asFormulaNumber(results["MSE"])); results["FA"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["FA"] = 0; }
  try { const v = (asFormulaNumber(results["MSB"])) / (asFormulaNumber(results["MSE"])); results["FB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["FB"] = 0; }
  try { const v = (asFormulaNumber(results["MSAB"])) / (asFormulaNumber(results["MSE"])); results["FAB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["FAB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTwo_way_anova_calculator(input: Two_way_anova_calculatorInput): Two_way_anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["FAB"]);
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


export interface Two_way_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
