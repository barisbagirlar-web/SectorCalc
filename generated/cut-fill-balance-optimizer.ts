// Auto-generated from cut-fill-balance-optimizer-schema.json
import * as z from 'zod';

export interface Cut_fill_balance_optimizerInput {
  cutVolume: number;
  fillVolume: number;
  swellFactor: number;
  shrinkageFactor: number;
  haulDistance: number;
  unitHaulCost: number;
  wasteDisposalCost: number;
  borrowCost: number;
  materialType: string;
  useOptimizedHaulRoutes: boolean;
}

export const Cut_fill_balance_optimizerInputSchema = z.object({
  cutVolume: z.number().min(0).max(1000000).default(10000),
  fillVolume: z.number().min(0).max(1000000).default(8000),
  swellFactor: z.number().min(1).max(1.5).default(1.25),
  shrinkageFactor: z.number().min(0.7).max(1).default(0.85),
  haulDistance: z.number().min(0.1).max(100).default(5),
  unitHaulCost: z.number().min(0.1).max(10).default(0.5),
  wasteDisposalCost: z.number().min(0).max(50).default(3),
  borrowCost: z.number().min(0).max(100).default(5),
  materialType: z.enum(['Common Earth', 'Rock', 'Sand & Gravel', 'Clay']).default('Common Earth'),
  useOptimizedHaulRoutes: z.boolean().default(true),
});

function evaluateAllFormulas(input: Cut_fill_balance_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cutVolume * input.shrinkageFactor; results["adjustedCutVolume"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedCutVolume"] = 0; }
  try { const v = input.fillVolume * input.swellFactor; results["adjustedFillVolume"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedFillVolume"] = 0; }
  try { const v = (results["adjustedCutVolume"] ?? 0) - input.fillVolume; results["netBalance"] = Number.isFinite(v) ? v : 0; } catch { results["netBalance"] = 0; }
  try { const v = Math.max(0, (results["netBalance"] ?? 0)); results["excessCutVolume"] = Number.isFinite(v) ? v : 0; } catch { results["excessCutVolume"] = 0; }
  try { const v = Math.max(0, -(results["netBalance"] ?? 0)); results["deficitFillVolume"] = Number.isFinite(v) ? v : 0; } catch { results["deficitFillVolume"] = 0; }
  try { const v = Math.min((results["adjustedCutVolume"] ?? 0), input.fillVolume) * input.swellFactor + ((results["excessCutVolume"] ?? 0) * input.swellFactor) + ((results["deficitFillVolume"] ?? 0) * input.swellFactor); results["totalHaulVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalHaulVolume"] = 0; }
  try { const v = ((results["totalHaulVolume"] ?? 0) * input.unitHaulCost * input.haulDistance) + ((results["excessCutVolume"] ?? 0) * input.wasteDisposalCost) + ((results["deficitFillVolume"] ?? 0) * input.borrowCost); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateCut_fill_balance_optimizer(input: Cut_fill_balance_optimizerInput): Cut_fill_balance_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
  const breakdown = {
    haulCost: values["haulCost"] ?? 0,
    wasteCost: values["wasteCost"] ?? 0,
    borrowCost: values["borrowCost"] ?? 0,
    netBalance: values["netBalance"] ?? 0,
    totalHaulVolume: values["totalHaulVolume"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Rehandle Ratio","Idle Equipment Time","Fuel Waste Factor"];
  const suggestedActions: string[] = ["Optimize Haul Routes","Revise Cut/Fill Design","On-Site Material Processing","Implement Lean Haul Practices"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated haul route optimization"],
  };
}


export interface Cut_fill_balance_optimizerOutput {
  totalWasteCost: number;
  breakdown: { haulCost: number; wasteCost: number; borrowCost: number; netBalance: number; totalHaulVolume: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
