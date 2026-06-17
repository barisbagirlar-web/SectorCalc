// @ts-nocheck
// Auto-generated from brewsters-angle-calculator-schema.json
import * as z from 'zod';

export interface Brewsters_angle_calculatorInput {
  n1: number;
  n2: number;
  temperature: number;
  temp_coefficient: number;
  reference_temp: number;
  angle_unit: number;
}

export const Brewsters_angle_calculatorInputSchema = z.object({
  n1: z.number().default(1),
  n2: z.number().default(1.5),
  temperature: z.number().default(20),
  temp_coefficient: z.number().default(0.0001),
  reference_temp: z.number().default(20),
  angle_unit: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brewsters_angle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.n2 + input.temp_coefficient * (input.temperature - input.reference_temp); results["corrected_n2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["corrected_n2"] = 0; }
  try { const v = input.n2 + input.temp_coefficient * (input.temperature - input.reference_temp); results["corrected_n2_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["corrected_n2_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBrewsters_angle_calculator(input: Brewsters_angle_calculatorInput): Brewsters_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["corrected_n2_aux"]);
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


export interface Brewsters_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
