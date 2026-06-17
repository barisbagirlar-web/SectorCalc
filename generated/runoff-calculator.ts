// @ts-nocheck
// Auto-generated from runoff-calculator-schema.json
import * as z from 'zod';

export interface Runoff_calculatorInput {
  catchmentArea: number;
  runoffCoefficient: number;
  rainfallIntensity: number;
  safetyFactor: number;
}

export const Runoff_calculatorInputSchema = z.object({
  catchmentArea: z.number(),
  runoffCoefficient: z.number(),
  rainfallIntensity: z.number(),
  safetyFactor: z.number(),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Runoff_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.runoffCoefficient * input.rainfallIntensity * input.catchmentArea / 3600; results["runoffBase"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["runoffBase"] = 0; }
  try { const v = (asFormulaNumber(results["runoffBase"])) * input.safetyFactor; results["runoffLps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["runoffLps"] = 0; }
  try { const v = (asFormulaNumber(results["runoffLps"])) / 1000; results["runoffM3s"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["runoffM3s"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRunoff_calculator(input: Runoff_calculatorInput): Runoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["runoffLps"]);
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


export interface Runoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
