// Auto-generated from fence-calculator-schema.json
import * as z from 'zod';

export interface Fence_calculatorInput {
  totalLength: number;
  fenceHeight: number;
  postSpacing: number;
  pricePerPost: number;
  pricePanelPerSqm: number;
  numberOfGates: number;
  pricePerGate: number;
  concreteCostPerPost: number;
}

export const Fence_calculatorInputSchema = z.object({
  totalLength: z.number().default(20),
  fenceHeight: z.number().default(1.8),
  postSpacing: z.number().default(2.5),
  pricePerPost: z.number().default(15),
  pricePanelPerSqm: z.number().default(20),
  numberOfGates: z.number().default(1),
  pricePerGate: z.number().default(200),
  concreteCostPerPost: z.number().default(5),
});

function evaluateAllFormulas(input: Fence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.totalLength / input.postSpacing) + 1; results["numberPosts"] = Number.isFinite(v) ? v : 0; } catch { results["numberPosts"] = 0; }
  try { const v = input.totalLength * input.fenceHeight; results["totalPanelArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalPanelArea"] = 0; }
  try { const v = (results["numberPosts"] ?? 0) * input.pricePerPost; results["totalPostCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalPostCost"] = 0; }
  try { const v = (results["totalPanelArea"] ?? 0) * input.pricePanelPerSqm; results["totalPanelCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalPanelCost"] = 0; }
  try { const v = (results["numberPosts"] ?? 0) * input.concreteCostPerPost; results["totalConcreteCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalConcreteCost"] = 0; }
  try { const v = input.numberOfGates * input.pricePerGate; results["totalGateCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalGateCost"] = 0; }
  try { const v = (results["totalPostCost"] ?? 0) + (results["totalPanelCost"] ?? 0) + (results["totalConcreteCost"] ?? 0) + (results["totalGateCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateFence_calculator(input: Fence_calculatorInput): Fence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Fence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
