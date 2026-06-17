// @ts-nocheck
// Auto-generated from equestrian-calculator-schema.json
import * as z from 'zod';

export interface Equestrian_calculatorInput {
  load_mass: number;
  slope_percent: number;
  rolling_resistance: number;
  desired_speed: number;
  horse_pull_force: number;
  efficiency: number;
}

export const Equestrian_calculatorInputSchema = z.object({
  load_mass: z.number().default(1000),
  slope_percent: z.number().default(5),
  rolling_resistance: z.number().default(0.02),
  desired_speed: z.number().default(1.5),
  horse_pull_force: z.number().default(1000),
  efficiency: z.number().default(85),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Equestrian_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.load_mass + input.slope_percent + input.rolling_resistance; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.load_mass + input.slope_percent + input.rolling_resistance; results["result_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEquestrian_calculator(input: Equestrian_calculatorInput): Equestrian_calculatorOutput {
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


export interface Equestrian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
