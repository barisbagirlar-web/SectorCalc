// @ts-nocheck
// Auto-generated from madrs-calculator-schema.json
import * as z from 'zod';

export interface Madrs_calculatorInput {
  axleDiameter: number;
  axleLength: number;
  load: number;
  elasticModulus: number;
  safetyFactor: number;
}

export const Madrs_calculatorInputSchema = z.object({
  axleDiameter: z.number().default(50),
  axleLength: z.number().default(500),
  load: z.number().default(1000),
  elasticModulus: z.number().default(210),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Madrs_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.axleDiameter + input.axleLength + input.load; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.axleDiameter + input.axleLength + input.load; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMadrs_calculator(input: Madrs_calculatorInput): Madrs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Madrs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
