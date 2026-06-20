// Auto-generated from changeover-matrix-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Changeover_matrix_optimizer_calculatorInput {
  changeover_time_matrix: number;
  number_of_changeovers_per_month: number;
  setup_external_time: number;
  setup_internal_time: number;
  product_family_count: number;
  standard_deviation_changeover_time: number;
  shift_pattern: string;
  lean_smed_implemented: boolean;
  dataConfidence?: number;
}

export const Changeover_matrix_optimizer_calculatorInputSchema = z.object({
  changeover_time_matrix: z.number().min(0).max(480).default(45),
  number_of_changeovers_per_month: z.number().min(1).max(1000).default(120),
  setup_external_time: z.number().min(0).max(240).default(15),
  setup_internal_time: z.number().min(0).max(480).default(30),
  product_family_count: z.number().min(2).max(50).default(5),
  standard_deviation_changeover_time: z.number().min(0).max(120).default(8),
  shift_pattern: z.enum(['1-shift', '2-shift', '3-shift', 'continuous']).default('2-shift'),
  lean_smed_implemented: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Changeover_matrix_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.changeover_time_matrix * input.number_of_changeovers_per_month * input.setup_external_time * input.setup_internal_time; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.changeover_time_matrix * input.number_of_changeovers_per_month * input.setup_external_time * input.setup_internal_time * (input.product_family_count * input.standard_deviation_changeover_time); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.product_family_count * input.standard_deviation_changeover_time; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateChangeover_matrix_optimizer_calculator(input: Changeover_matrix_optimizer_calculatorInput): Changeover_matrix_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Automated SMED video analysis integration","Real-time OEE dashboard sync"],
  };
}


export interface Changeover_matrix_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
