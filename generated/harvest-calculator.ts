// Auto-generated from harvest-calculator-schema.json
import * as z from 'zod';

export interface Harvest_calculatorInput {
  fieldArea: number;
  cropYieldPerHectare: number;
  fieldLossPercent: number;
  storageLossPercent: number;
}

export const Harvest_calculatorInputSchema = z.object({
  fieldArea: z.number().default(1),
  cropYieldPerHectare: z.number().default(5),
  fieldLossPercent: z.number().default(3),
  storageLossPercent: z.number().default(2),
});

function evaluateAllFormulas(input: Harvest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fieldArea * input.cropYieldPerHectare; results["grossHarvest"] = Number.isFinite(v) ? v : 0; } catch { results["grossHarvest"] = 0; }
  try { const v = (results["grossHarvest"] ?? 0) * (input.fieldLossPercent / 100); results["fieldLoss"] = Number.isFinite(v) ? v : 0; } catch { results["fieldLoss"] = 0; }
  try { const v = ((results["grossHarvest"] ?? 0) - (results["fieldLoss"] ?? 0)) * (input.storageLossPercent / 100); results["storageLoss"] = Number.isFinite(v) ? v : 0; } catch { results["storageLoss"] = 0; }
  try { const v = (results["grossHarvest"] ?? 0) - (results["fieldLoss"] ?? 0) - (results["storageLoss"] ?? 0); results["netHarvest"] = Number.isFinite(v) ? v : 0; } catch { results["netHarvest"] = 0; }
  return results;
}


export function calculateHarvest_calculator(input: Harvest_calculatorInput): Harvest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netHarvest"] ?? 0;
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


export interface Harvest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
