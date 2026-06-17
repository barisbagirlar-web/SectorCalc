// @ts-nocheck
// Auto-generated from compare-fractions-calculator-schema.json
import * as z from 'zod';

export interface Compare_fractions_calculatorInput {
  num1: number;
  den1: number;
  num2: number;
  den2: number;
}

export const Compare_fractions_calculatorInputSchema = z.object({
  num1: z.number().default(1),
  den1: z.number().default(2),
  num2: z.number().default(3),
  den2: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compare_fractions_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.den1 !== 0 ? input.num1/input.den1 : NaN; results["val1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["val1"] = 0; }
  try { const v = input.den2 !== 0 ? input.num2/input.den2 : NaN; results["val2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["val2"] = 0; }
  try { const v = (asFormulaNumber(results["val1"])) - (asFormulaNumber(results["val2"])); results["diff"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["diff"] = 0; }
  try { const v = (asFormulaNumber(results["diff"])) > 0 ? 1 : ((asFormulaNumber(results["diff"])) < 0 ? -1 : 0); results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (asFormulaNumber(results["val1"])); results["breakdown0"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown0"] = 0; }
  try { const v = (asFormulaNumber(results["val2"])); results["breakdown1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown1"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompare_fractions_calculator(input: Compare_fractions_calculatorInput): Compare_fractions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Compare_fractions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
