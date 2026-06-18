// @ts-nocheck
// Auto-generated from sewing-line-balancer-calculator-schema.json
import * as z from 'zod';

export interface Sewing_line_balancer_calculatorInput {
  total_work_content: number;
  number_of_operators: number;
  takt_time: number;
  bottleneck_time: number;
  line_balance_type: string;
  allow_rebalancing: boolean;
}

export const Sewing_line_balancer_calculatorInputSchema = z.object({
  total_work_content: z.number().min(60).max(36000).default(3600),
  number_of_operators: z.number().min(1).max(200).default(20),
  takt_time: z.number().min(10).max(600).default(180),
  bottleneck_time: z.number().min(10).max(600).default(200),
  line_balance_type: z.enum(['straight', 'u_shape', 'modular']).default('straight'),
  allow_rebalancing: z.boolean().default(true),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sewing_line_balancer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_work_content * input.number_of_operators * input.takt_time * input.bottleneck_time; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.total_work_content * input.number_of_operators * input.takt_time * input.bottleneck_time; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSewing_line_balancer_calculator(input: Sewing_line_balancer_calculatorInput): Sewing_line_balancer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","What-if simulation","Multi-line comparison"],
  };
}


export interface Sewing_line_balancer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
