// Auto-generated from cpm-delay-penalty-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Cpm_delay_penalty_optimizer_calculatorInput {
  planned_duration_days: number;
  actual_duration_days: number;
  daily_penalty_rate: number;
  critical_path_float_total: number;
  productivity_factor: number;
  rework_percentage: number;
  delay_type: string;
  use_earned_schedule: boolean;
  dataConfidence?: number;
}

export const Cpm_delay_penalty_optimizer_calculatorInputSchema = z.object({
  planned_duration_days: z.number().min(1).max(3650).default(100),
  actual_duration_days: z.number().min(1).max(3650).default(110),
  daily_penalty_rate: z.number().min(0).max(1000000).default(5000),
  critical_path_float_total: z.number().min(0).max(365).default(5),
  productivity_factor: z.number().min(0.1).max(1).default(0.85),
  rework_percentage: z.number().min(0).max(100).default(12),
  delay_type: z.enum(['excusable_compensable', 'excusable_non_compensable', 'non_excusable', 'concurrent']).default('excusable_compensable'),
  use_earned_schedule: z.boolean().default(true),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cpm_delay_penalty_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planned_duration_days * input.actual_duration_days * (input.daily_penalty_rate / 100) * input.critical_path_float_total; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.planned_duration_days * input.actual_duration_days * (input.daily_penalty_rate / 100) * input.critical_path_float_total * (input.productivity_factor * (input.rework_percentage / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.productivity_factor * (input.rework_percentage / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCpm_delay_penalty_optimizer_calculator(input: Cpm_delay_penalty_optimizer_calculatorInput): Cpm_delay_penalty_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-project portfolio view","Real-time dashboard integration"],
  };
}


export interface Cpm_delay_penalty_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
