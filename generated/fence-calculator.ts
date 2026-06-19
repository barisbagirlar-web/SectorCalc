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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalLength * input.fenceHeight; results["totalPanelArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPanelArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalPanelArea"])) * input.pricePanelPerSqm; results["totalPanelCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPanelCost"] = 0; }
  try { const v = input.numberOfGates * input.pricePerGate; results["totalGateCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGateCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFence_calculator(input: Fence_calculatorInput): Fence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalGateCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
