// Auto-generated from cac-calculator-schema.json
import * as z from 'zod';

export interface Cac_calculatorInput {
  marketingCosts: number;
  salesCosts: number;
  technologyCosts: number;
  otherCosts: number;
  newCustomers: number;
}

export const Cac_calculatorInputSchema = z.object({
  marketingCosts: z.number().default(10000),
  salesCosts: z.number().default(8000),
  technologyCosts: z.number().default(2000),
  otherCosts: z.number().default(1500),
  newCustomers: z.number().default(100),
});

function evaluateAllFormulas(input: Cac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketingCosts + input.salesCosts + input.technologyCosts + input.otherCosts; results["totalAcquisitionCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAcquisitionCost"] = 0; }
  try { const v = (results["totalAcquisitionCost"] ?? 0) / input.newCustomers; results["cac"] = Number.isFinite(v) ? v : 0; } catch { results["cac"] = 0; }
  try { const v = input.marketingCosts / (results["totalAcquisitionCost"] ?? 0); results["marketingCostRatio"] = Number.isFinite(v) ? v : 0; } catch { results["marketingCostRatio"] = 0; }
  return results;
}


export function calculateCac_calculator(input: Cac_calculatorInput): Cac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cac"] ?? 0;
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


export interface Cac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
