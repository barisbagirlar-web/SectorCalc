// Auto-generated from cpc-calculator-schema.json
import * as z from 'zod';

export interface Cpc_calculatorInput {
  total_cost: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

export const Cpc_calculatorInputSchema = z.object({
  total_cost: z.number().default(10000),
  clicks: z.number().default(500),
  impressions: z.number().default(10000),
  conversions: z.number().default(50),
});

function evaluateAllFormulas(input: Cpc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_cost / input.clicks; results["cpc"] = Number.isFinite(v) ? v : 0; } catch { results["cpc"] = 0; }
  try { const v = (input.clicks / input.impressions) * 100; results["ctr"] = Number.isFinite(v) ? v : 0; } catch { results["ctr"] = 0; }
  try { const v = (input.conversions / input.clicks) * 100; results["conversion_rate"] = Number.isFinite(v) ? v : 0; } catch { results["conversion_rate"] = 0; }
  try { const v = input.total_cost / input.conversions; results["cpa"] = Number.isFinite(v) ? v : 0; } catch { results["cpa"] = 0; }
  try { const v = ((input.conversions * 100) - input.total_cost) / input.total_cost * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateCpc_calculator(input: Cpc_calculatorInput): Cpc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cpc"] ?? 0;
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


export interface Cpc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
