// Auto-generated from hlb-calculator-schema.json
import * as z from 'zod';

export interface Hlb_calculatorInput {
  oil1_hlb: number;
  oil1_percent: number;
  oil2_hlb: number;
  oil2_percent: number;
  oil3_hlb: number;
  oil3_percent: number;
}

export const Hlb_calculatorInputSchema = z.object({
  oil1_hlb: z.number().default(0),
  oil1_percent: z.number().default(0),
  oil2_hlb: z.number().default(0),
  oil2_percent: z.number().default(0),
  oil3_hlb: z.number().default(0),
  oil3_percent: z.number().default(0),
});

function evaluateAllFormulas(input: Hlb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.oil1_hlb * input.oil1_percent + input.oil2_hlb * input.oil2_percent + input.oil3_hlb * input.oil3_percent) / (input.oil1_percent + input.oil2_percent + input.oil3_percent) || 0; results["requiredHLB"] = Number.isFinite(v) ? v : 0; } catch { results["requiredHLB"] = 0; }
  try { const v = input.oil1_percent + input.oil2_percent + input.oil3_percent; results["totalPercent"] = Number.isFinite(v) ? v : 0; } catch { results["totalPercent"] = 0; }
  try { const v = input.oil1_hlb * input.oil1_percent + input.oil2_hlb * input.oil2_percent + input.oil3_hlb * input.oil3_percent; results["weightedSum"] = Number.isFinite(v) ? v : 0; } catch { results["weightedSum"] = 0; }
  return results;
}


export function calculateHlb_calculator(input: Hlb_calculatorInput): Hlb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredHLB"] ?? 0;
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


export interface Hlb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
