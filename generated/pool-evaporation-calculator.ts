// @ts-nocheck
// Auto-generated from pool-evaporation-calculator-schema.json
import * as z from 'zod';

export interface Pool_evaporation_calculatorInput {
  surfaceArea: number;
  waterTemp: number;
  airTemp: number;
  relativeHumidity: number;
  windSpeed: number;
}

export const Pool_evaporation_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(50),
  waterTemp: z.number().default(28),
  airTemp: z.number().default(25),
  relativeHumidity: z.number().default(60),
  windSpeed: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pool_evaporation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.surfaceArea + input.waterTemp + input.airTemp; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.surfaceArea + input.waterTemp + input.airTemp; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePool_evaporation_calculator(input: Pool_evaporation_calculatorInput): Pool_evaporation_calculatorOutput {
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


export interface Pool_evaporation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
