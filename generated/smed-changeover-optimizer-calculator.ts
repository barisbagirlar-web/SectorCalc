// Auto-generated from smed-changeover-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Smed_changeover_optimizer_calculatorInput {
  current_changeover_time: number;
  internal_operations_percentage: number;
  setup_team_size: number;
  parallel_work_possible: boolean;
  standardization_level: string;
  waste_motion_score: number;
  dataConfidence?: number;
}

export const Smed_changeover_optimizer_calculatorInputSchema = z.object({
  current_changeover_time: z.number().min(1).max(480).default(45),
  internal_operations_percentage: z.number().min(0).max(100).default(60),
  setup_team_size: z.number().min(1).max(10).default(2),
  parallel_work_possible: z.boolean().default(true),
  standardization_level: z.enum(['low', 'medium', 'high']).default('medium'),
  waste_motion_score: z.number().min(1).max(10).default(6),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Smed_changeover_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.current_changeover_time * (input.internal_operations_percentage / 100) * input.setup_team_size * input.waste_motion_score; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.current_changeover_time * (input.internal_operations_percentage / 100) * input.setup_team_size * input.waste_motion_score; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSmed_changeover_optimizer_calculator(input: Smed_changeover_optimizer_calculatorInput): Smed_changeover_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-plant comparison"],
  };
}


export interface Smed_changeover_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
