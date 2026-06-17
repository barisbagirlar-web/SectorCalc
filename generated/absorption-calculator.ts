// @ts-nocheck
// Auto-generated from absorption-calculator-schema.json
import * as z from 'zod';

export interface Absorption_calculatorInput {
  budgetedOverhead: number;
  budgetedActivity: number;
  actualActivity: number;
  actualOverhead: number;
}

export const Absorption_calculatorInputSchema = z.object({
  budgetedOverhead: z.number().default(100000),
  budgetedActivity: z.number().default(10000),
  actualActivity: z.number().default(9500),
  actualOverhead: z.number().default(105000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Absorption_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.budgetedOverhead / input.budgetedActivity; results["absorptionRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["absorptionRate"] = 0; }
  try { const v = (asFormulaNumber(results["absorptionRate"])) * input.actualActivity; results["overheadAbsorbed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadAbsorbed"] = 0; }
  try { const v = input.actualOverhead - (asFormulaNumber(results["overheadAbsorbed"])); results["overUnderAbsorbed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overUnderAbsorbed"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAbsorption_calculator(input: Absorption_calculatorInput): Absorption_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["absorptionRate"]);
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


export interface Absorption_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
