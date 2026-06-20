// Auto-generated from twilight-calculator-schema.json
import * as z from 'zod';

export interface Twilight_calculatorInput {
  full_power: number;
  dimming_percent: number;
  exponent: number;
  operating_hours: number;
  cost_per_kwh: number;
  dataConfidence?: number;
}

export const Twilight_calculatorInputSchema = z.object({
  full_power: z.number().default(100),
  dimming_percent: z.number().default(30),
  exponent: z.number().default(2.2),
  operating_hours: z.number().default(12),
  cost_per_kwh: z.number().default(0.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Twilight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dimming_percent / 100) ** input.exponent; results["dimming_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dimming_factor"] = Number.NaN; }
  try { const v = input.full_power * (toNumericFormulaValue(results["dimming_factor"])); results["actual_power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actual_power"] = Number.NaN; }
  try { const v = (input.full_power - (toNumericFormulaValue(results["actual_power"]))) * input.operating_hours; results["daily_energy_saved_wh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daily_energy_saved_wh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["daily_energy_saved_wh"])) * input.cost_per_kwh / 1000; results["daily_cost_savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daily_cost_savings"] = Number.NaN; }
  return results;
}


export function calculateTwilight_calculator(input: Twilight_calculatorInput): Twilight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["daily_cost_savings"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
