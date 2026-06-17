// @ts-nocheck
// Auto-generated from twilight-calculator-schema.json
import * as z from 'zod';

export interface Twilight_calculatorInput {
  full_power: number;
  dimming_percent: number;
  exponent: number;
  operating_hours: number;
  cost_per_kwh: number;
}

export const Twilight_calculatorInputSchema = z.object({
  full_power: z.number().default(100),
  dimming_percent: z.number().default(30),
  exponent: z.number().default(2.2),
  operating_hours: z.number().default(12),
  cost_per_kwh: z.number().default(0.15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Twilight_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.dimming_percent / 100) ** input.exponent; results["dimming_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dimming_factor"] = 0; }
  try { const v = input.full_power * (asFormulaNumber(results["dimming_factor"])); results["actual_power"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actual_power"] = 0; }
  try { const v = (input.full_power - (asFormulaNumber(results["actual_power"]))) * input.operating_hours; results["daily_energy_saved_wh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daily_energy_saved_wh"] = 0; }
  try { const v = (asFormulaNumber(results["daily_energy_saved_wh"])) * input.cost_per_kwh / 1000; results["daily_cost_savings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daily_cost_savings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTwilight_calculator(input: Twilight_calculatorInput): Twilight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["daily_cost_savings"]);
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


export interface Twilight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
