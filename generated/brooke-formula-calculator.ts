// @ts-nocheck
// Auto-generated from brooke-formula-calculator-schema.json
import * as z from 'zod';

export interface Brooke_formula_calculatorInput {
  weight: number;
  tbsa: number;
  fluidFactor: number;
  firstPeriodHours: number;
  secondPeriodHours: number;
}

export const Brooke_formula_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  tbsa: z.number().default(20),
  fluidFactor: z.number().default(2),
  firstPeriodHours: z.number().default(8),
  secondPeriodHours: z.number().default(16),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brooke_formula_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fluidFactor * input.weight * input.tbsa; results["totalFluid"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFluid"] = 0; }
  try { const v = (asFormulaNumber(results["totalFluid"])) / 2; results["firstHalf"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["firstHalf"] = 0; }
  try { const v = (asFormulaNumber(results["totalFluid"])) / 2; results["secondHalf"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["secondHalf"] = 0; }
  try { const v = (asFormulaNumber(results["firstHalf"])) / input.firstPeriodHours; results["firstHourlyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["firstHourlyRate"] = 0; }
  try { const v = (asFormulaNumber(results["secondHalf"])) / input.secondPeriodHours; results["secondHourlyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["secondHourlyRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBrooke_formula_calculator(input: Brooke_formula_calculatorInput): Brooke_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFluid"]);
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


export interface Brooke_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
