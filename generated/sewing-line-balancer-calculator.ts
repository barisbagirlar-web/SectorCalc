// Auto-generated from sewing-line-balancer-calculator-schema.json
import * as z from 'zod';

export interface Sewing_line_balancer_calculatorInput {
  total_work_content: number;
  number_of_operators: number;
  takt_time: number;
  bottleneck_time: number;
  line_balance_type: string;
  allow_rebalancing: boolean;
  dataConfidence?: number;
}

export const Sewing_line_balancer_calculatorInputSchema = z.object({
  total_work_content: z.number().min(60).max(36000).default(3600),
  number_of_operators: z.number().min(1).max(200).default(20),
  takt_time: z.number().min(10).max(600).default(180),
  bottleneck_time: z.number().min(10).max(600).default(200),
  line_balance_type: z.enum(['straight', 'u_shape', 'modular']).default('straight'),
  allow_rebalancing: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sewing_line_balancer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.total_work_content / (input.number_of_operators * input.bottleneck_time)) * 100; results["balance_efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["balance_efficiency"] = Number.NaN; }
  try { const v = Math.ceil(input.total_work_content / input.takt_time); results["theoretical_min_operators"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoretical_min_operators"] = Number.NaN; }
  try { const v = input.number_of_operators - (toNumericFormulaValue(results["theoretical_min_operators"])); results["excess_operators"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["excess_operators"] = Number.NaN; }
  try { const v = ((input.total_work_content / (input.number_of_operators * input.bottleneck_time)) * 100) - ((toNumericFormulaValue(results["excess_operators"])) * 2); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSewing_line_balancer_calculator(input: Sewing_line_balancer_calculatorInput): Sewing_line_balancer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    balance_efficiency: toNumericFormulaValue(values["balance_efficiency"]),
    theoretical_min_operators: toNumericFormulaValue(values["theoretical_min_operators"]),
    excess_operators: toNumericFormulaValue(values["excess_operators"])
  };
  const hiddenLossDrivers: string[] = ["High bottleneck time relative to takt time","Excess operators beyond theoretical minimum"];
  const suggestedActions: string[] = ["Reallocate operators to reduce bottleneck time","Implement cross-training to increase flexibility"];
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","What-if simulation","Multi-line comparison"],
  };
}


export interface Sewing_line_balancer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { balance_efficiency: number; theoretical_min_operators: number; excess_operators: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sewing_line_balancer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["balance_efficiency","theoretical_min_operators","excess_operators"],
} as const;

