// @ts-nocheck
// Auto-generated from gibibytes-to-gigabytes-calculator-schema.json
import * as z from 'zod';

export interface Gibibytes_to_gigabytes_calculatorInput {
  gibibytes: number;
  conversionFactor: number;
  decimalPlaces: number;
  safetyFactorPercent: number;
}

export const Gibibytes_to_gigabytes_calculatorInputSchema = z.object({
  gibibytes: z.number().default(1),
  conversionFactor: z.number().default(1.073741824),
  decimalPlaces: z.number().default(2),
  safetyFactorPercent: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gibibytes_to_gigabytes_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gibibytes * input.conversionFactor; results["rawGigabytes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawGigabytes"] = 0; }
  try { const v = (asFormulaNumber(results["rawGigabytes"])) * (1 + input.safetyFactorPercent / 100); results["safetyAppliedGigabytes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyAppliedGigabytes"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGibibytes_to_gigabytes_calculator(input: Gibibytes_to_gigabytes_calculatorInput): Gibibytes_to_gigabytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["safetyAppliedGigabytes"]);
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


export interface Gibibytes_to_gigabytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
