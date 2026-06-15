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

function evaluateAllFormulas(input: Spc_limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["d2_constant"] = lookup_d2(input.subgroup_size); } catch { results["d2_constant"] = 0; }
  try { results["estimated_sigma"] = sigma_hat = input.average_range / d2; } catch { results["estimated_sigma"] = 0; }
  try { results["ucl_xbar"] = input.overall_mean + (A2 * input.average_range); } catch { results["ucl_xbar"] = 0; }
  try { results["lcl_xbar"] = input.overall_mean - (A2 * input.average_range); } catch { results["lcl_xbar"] = 0; }
  try { results["ucl_r"] = D4 * input.average_range; } catch { results["ucl_r"] = 0; }
  try { results["lcl_r"] = D3 * input.average_range; } catch { results["lcl_r"] = 0; }
  try { results["cpk"] = Math.min((input.usl - input.overall_mean) / (3 * sigma_hat), (input.overall_mean - input.lsl) / (3 * sigma_hat)); } catch { results["cpk"] = 0; }
  return results;
}


export function calculateSpc_limit_calculator(input: Spc_limit_calculatorInput): Spc_limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cpk"] ?? 0;
  const breakdown = {
    ucl_xbar: values["ucl_xbar"] ?? 0,
    lcl_xbar: values["lcl_xbar"] ?? 0,
    ucl_r: values["ucl_r"] ?? 0,
    lcl_r: values["lcl_r"] ?? 0,
    estimated_sigma: values["estimated_sigma"] ?? 0,
    cp: values["cp"] ?? 0,
    ppk: values["ppk"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Centering Shift","Excess Variation","Special Cause Count"];
  const suggestedActions: string[] = ["If Cpk < 1.33 and centering shift > 0.5*σ, adjust process target to midpoint of specification limits.","If Cp < 1.33, implement process improvement (e.g., DOE, SMED, Poka-Yoke) to reduce common cause variation.","If special cause count > 0, perform root cause analysis using 5 Whys or fishbone diagram.","If Ppk significantly lower than Cpk, conduct Gage R&R study to assess measurement system variation.","After process improvement, recalculate control limits with new data to reflect improved state."];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time data streaming","Multi-plant comparison"],
  };
}


export interface Spc_limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: { ucl_xbar: number; lcl_xbar: number; ucl_r: number; lcl_r: number; estimated_sigma: number; cp: number; ppk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
