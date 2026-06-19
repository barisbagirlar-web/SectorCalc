// Auto-generated from hours-to-days-calculator-schema.json
import * as z from 'zod';

export interface Hours_to_days_calculatorInput {
  total_hours: number;
  daily_shift_hours: number;
  break_hours_per_shift: number;
  shifts_per_day: number;
  efficiency_factor: number;
  setup_time: number;
  dataConfidence?: number;
}

export const Hours_to_days_calculatorInputSchema = z.object({
  total_hours: z.number().default(100),
  daily_shift_hours: z.number().default(8),
  break_hours_per_shift: z.number().default(0.5),
  shifts_per_day: z.number().default(1),
  efficiency_factor: z.number().default(1),
  setup_time: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hours_to_days_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.total_hours / input.efficiency_factor) + input.setup_time; results["required_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["required_hours"] = 0; }
  try { const v = input.daily_shift_hours - input.break_hours_per_shift; results["effective_hours_per_shift"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_hours_per_shift"] = 0; }
  try { const v = (asFormulaNumber(results["effective_hours_per_shift"])) * input.shifts_per_day; results["effective_hours_per_day"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_hours_per_day"] = 0; }
  try { const v = (asFormulaNumber(results["required_hours"])) / (asFormulaNumber(results["effective_hours_per_day"])); results["days"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["days"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHours_to_days_calculator(input: Hours_to_days_calculatorInput): Hours_to_days_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["days"]);
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


export interface Hours_to_days_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
