// Auto-generated from k-d-ratio-calculator-schema.json
import * as z from 'zod';

export interface K_d_ratio_calculatorInput {
  accepted_parts: number;
  defective_parts: number;
  reworked_parts: number;
  total_inspected: number;
}

export const K_d_ratio_calculatorInputSchema = z.object({
  accepted_parts: z.number().default(0),
  defective_parts: z.number().default(0),
  reworked_parts: z.number().default(0),
  total_inspected: z.number().default(0),
});

function evaluateAllFormulas(input: K_d_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.defective_parts === 0 ? 0 : input.accepted_parts / input.defective_parts; results["kd_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["kd_ratio"] = 0; }
  try { const v = input.total_inspected === 0 ? 0 : input.defective_parts / input.total_inspected; results["defect_rate"] = Number.isFinite(v) ? v : 0; } catch { results["defect_rate"] = 0; }
  try { const v = input.total_inspected === 0 ? 0 : input.accepted_parts / input.total_inspected; results["quality_yield"] = Number.isFinite(v) ? v : 0; } catch { results["quality_yield"] = 0; }
  try { const v = input.total_inspected === 0 ? 0 : input.reworked_parts / input.total_inspected; results["rework_rate"] = Number.isFinite(v) ? v : 0; } catch { results["rework_rate"] = 0; }
  return results;
}


export function calculateK_d_ratio_calculator(input: K_d_ratio_calculatorInput): K_d_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["kd_ratio"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface K_d_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
