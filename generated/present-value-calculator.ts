// @ts-nocheck
// Auto-generated from present-value-calculator-schema.json
import * as z from 'zod';

export interface Present_value_calculatorInput {
  futureValue: number;
  discountRate: number;
  periods: number;
  compoundingFrequency: number;
}

export const Present_value_calculatorInputSchema = z.object({
  futureValue: z.number().default(1000),
  discountRate: z.number().default(5),
  periods: z.number().default(10),
  compoundingFrequency: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Present_value_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.discountRate / 100; results["rateDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rateDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["rateDecimal"])) / input.compoundingFrequency; results["periodRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["periodRate"] = 0; }
  try { const v = input.periods * input.compoundingFrequency; results["totalPeriods"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPeriods"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePresent_value_calculator(input: Present_value_calculatorInput): Present_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPeriods"]);
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


export interface Present_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
