// @ts-nocheck
// Auto-generated from number-needed-to-treat-calculator-schema.json
import * as z from 'zod';

export interface Number_needed_to_treat_calculatorInput {
  controlEvents: number;
  controlTotal: number;
  treatmentEvents: number;
  treatmentTotal: number;
}

export const Number_needed_to_treat_calculatorInputSchema = z.object({
  controlEvents: z.number().default(20),
  controlTotal: z.number().default(100),
  treatmentEvents: z.number().default(15),
  treatmentTotal: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Number_needed_to_treat_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.controlEvents / input.controlTotal * 100; results["controlRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["controlRate"] = 0; }
  try { const v = input.treatmentEvents / input.treatmentTotal * 100; results["treatmentRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["treatmentRate"] = 0; }
  try { const v = (asFormulaNumber(results["controlRate"])) - (asFormulaNumber(results["treatmentRate"])); results["arr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["arr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNumber_needed_to_treat_calculator(input: Number_needed_to_treat_calculatorInput): Number_needed_to_treat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["arr"]);
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


export interface Number_needed_to_treat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
