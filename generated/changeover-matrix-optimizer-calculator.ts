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
  try { const v = input.number_of_changeovers_per_month * input.changeover_time_matrix; results["total_changeover_downtime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_changeover_downtime"] = Number.NaN; }
  try { const v = input.setup_internal_time - (input.setup_external_time * 0.5); results["smed_reduction_potential"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["smed_reduction_potential"] = Number.NaN; }
  try { const v = (input.changeover_time_matrix - input.setup_internal_time) / (input.standard_deviation_changeover_time + 0.001); results["six_sigma_sigma_level"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["six_sigma_sigma_level"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_changeover_downtime"])) * (1 - (input.lean_smed_implemented ? 0.3 : 0)) * (1 + (input.product_family_count - 1) * 0.05) * (1 + (input.standard_deviation_changeover_time / (input.changeover_time_matrix + 0.001)) * 0.2); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateChangeover_matrix_optimizer_calculator(input: Changeover_matrix_optimizer_calculatorInput): Changeover_matrix_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    total_changeover_downtime: toNumericFormulaValue(values["total_changeover_downtime"]),
    smed_reduction_potential: toNumericFormulaValue(values["smed_reduction_potential"])
  };
  const hiddenLossDrivers: string[] = ["Unplanned downtime due to tooling issues","Lack of standardized work instructions"];
  const suggestedActions: string[] = ["Implement SMED to convert internal setup to external","Standardize changeover procedures across shifts"];
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
    unit: "hours",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Automated SMED video analysis integration","Real-time OEE dashboard sync"],
  };
}


export interface Changeover_matrix_optimizer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { total_changeover_downtime: number; smed_reduction_potential: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Changeover_matrix_optimizer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "hours",
  breakdownKeys: ["total_changeover_downtime","smed_reduction_potential"],
} as const;

