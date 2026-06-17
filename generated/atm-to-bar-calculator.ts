// @ts-nocheck
// Auto-generated from atm-to-bar-calculator-schema.json
import * as z from 'zod';

export interface Atm_to_bar_calculatorInput {
  pressure_atm: number;
  conversion_factor: number;
  precision: number;
  temperature_celsius: number;
  altitude_meters: number;
  measurement_uncertainty: number;
}

export const Atm_to_bar_calculatorInputSchema = z.object({
  pressure_atm: z.number().default(1),
  conversion_factor: z.number().default(1.01325),
  precision: z.number().default(2),
  temperature_celsius: z.number().default(20),
  altitude_meters: z.number().default(0),
  measurement_uncertainty: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atm_to_bar_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pressure_atm * input.conversion_factor; results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.pressure_atm; results["breakdown"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAtm_to_bar_calculator(input: Atm_to_bar_calculatorInput): Atm_to_bar_calculatorOutput {
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


export interface Atm_to_bar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
