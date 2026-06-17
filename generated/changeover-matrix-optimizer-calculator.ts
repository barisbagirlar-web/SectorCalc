// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Changeover_matrix_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.changeover_time_matrix + input.number_of_changeovers_per_month + input.setup_external_time; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.changeover_time_matrix + input.number_of_changeovers_per_month + input.setup_external_time; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateChangeover_matrix_optimizer_calculator(input: Changeover_matrix_optimizer_calculatorInput): Changeover_matrix_optimizer_calculatorOutput {
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
