// Auto-generated from spc-limit-calculator-schema.json
import * as z from 'zod';

export interface Spc_limit_calculatorInput {
  subgroup_size: number;
  num_subgroups: number;
  overall_mean: number;
  average_range: number;
  usl: number;
  lsl: number;
  chart_type: string;
  use_estimated_sigma: boolean;
  dataConfidence?: number;
}

export const Spc_limit_calculatorInputSchema = z.object({
  subgroup_size: z.number().min(2).max(25).default(5),
  num_subgroups: z.number().min(10).max(100).default(20),
  overall_mean: z.number().min(0).max(1000).default(50),
  average_range: z.number().min(0.1).max(100).default(5),
  usl: z.number().min(0).max(1000).default(60),
  lsl: z.number().min(0).max(1000).default(40),
  chart_type: z.enum(['Xbar-R', 'Xbar-s', 'I-MR']).default('Xbar-R'),
  use_estimated_sigma: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spc_limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.577 + (input.subgroup_size - 5) * 0.086; results["a2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["a2"] = Number.NaN; }
  try { const v = 1 + (input.subgroup_size - 2) * 0.135; results["d3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d3"] = Number.NaN; }
  try { const v = 3.267 - (input.subgroup_size - 2) * 0.174; results["d4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d4"] = Number.NaN; }
  try { const v = input.overall_mean + (toNumericFormulaValue(results["a2"])) * input.average_range; results["ucl_xbar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ucl_xbar"] = Number.NaN; }
  try { const v = input.overall_mean - (toNumericFormulaValue(results["a2"])) * input.average_range; results["lcl_xbar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lcl_xbar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["d4"])) * input.average_range; results["ucl_r"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ucl_r"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["d3"])) * input.average_range; results["lcl_r"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lcl_r"] = Number.NaN; }
  try { const v = input.average_range / 2.326; results["estimated_sigma"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimated_sigma"] = Number.NaN; }
  try { const v = Math.max(0, (input.usl - input.lsl) / (6 * (toNumericFormulaValue(results["estimated_sigma"])))); results["cp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cp"] = Number.NaN; }
  try { const v = Math.min((input.usl - input.overall_mean) / (3 * (toNumericFormulaValue(results["estimated_sigma"]))), (input.overall_mean - input.lsl) / (3 * (toNumericFormulaValue(results["estimated_sigma"])))); results["cpk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cpk"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cpk"])); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSpc_limit_calculator(input: Spc_limit_calculatorInput): Spc_limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    ucl_xbar: toNumericFormulaValue(values["ucl_xbar"]),
    lcl_xbar: toNumericFormulaValue(values["lcl_xbar"]),
    ucl_r: toNumericFormulaValue(values["ucl_r"]),
    lcl_r: toNumericFormulaValue(values["lcl_r"]),
    cp: toNumericFormulaValue(values["cp"]),
    cpk: toNumericFormulaValue(values["cpk"])
  };
  const hiddenLossDrivers: string[] = ["Out-of-control points not detected in real time","Common-cause variation masking special-cause signals"];
  const suggestedActions: string[] = ["Plot X-bar and R charts weekly","Investigate any point beyond control limits within 24 hours"];
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
    unit: "dimensionless",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time data streaming","Multi-plant comparison"],
  };
}


export interface Spc_limit_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ucl_xbar: number; lcl_xbar: number; ucl_r: number; lcl_r: number; cp: number; cpk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spc_limit_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "dimensionless",
  breakdownKeys: ["ucl_xbar","lcl_xbar","ucl_r","lcl_r","cp","cpk"],
} as const;

