// Auto-generated from level-of-service-calculator-schema.json
import * as z from 'zod';

export interface Level_of_service_calculatorInput {
  meanDemandDdlt: number;
  stdDevDemandDdlt: number;
  reorderPoint: number;
  orderQuantity: number;
}

export const Level_of_service_calculatorInputSchema = z.object({
  meanDemandDdlt: z.number().default(1000),
  stdDevDemandDdlt: z.number().default(200),
  reorderPoint: z.number().default(1200),
  orderQuantity: z.number().default(500),
});

function evaluateAllFormulas(input: Level_of_service_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.reorderPoint - input.meanDemandDdlt) / input.stdDevDemandDdlt; results["z"] = Number.isFinite(v) ? v : 0; } catch { results["z"] = 0; }
  try { const v = 1 / (1 + Math.exp(-0.07056 * Math.pow((results["z"] ?? 0), 3) - 1.5976 * (results["z"] ?? 0))); results["csl"] = Number.isFinite(v) ? v : 0; } catch { results["csl"] = 0; }
  try { const v = input.reorderPoint - input.meanDemandDdlt; results["safetyStock"] = Number.isFinite(v) ? v : 0; } catch { results["safetyStock"] = 0; }
  try { const v = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((results["z"] ?? 0), 2)); results["standardNormalPDF"] = Number.isFinite(v) ? v : 0; } catch { results["standardNormalPDF"] = 0; }
  try { const v = (results["standardNormalPDF"] ?? 0) - (results["z"] ?? 0) * (1 - (results["csl"] ?? 0)); results["standardNormalLoss"] = Number.isFinite(v) ? v : 0; } catch { results["standardNormalLoss"] = 0; }
  try { const v = 1 - (input.stdDevDemandDdlt * (results["standardNormalLoss"] ?? 0)) / input.orderQuantity; results["fillRate"] = Number.isFinite(v) ? v : 0; } catch { results["fillRate"] = 0; }
  try { const v = (results["csl"] ?? 0) * 100; results["cslPercent"] = Number.isFinite(v) ? v : 0; } catch { results["cslPercent"] = 0; }
  try { const v = (results["fillRate"] ?? 0) * 100; results["fillRatePercent"] = Number.isFinite(v) ? v : 0; } catch { results["fillRatePercent"] = 0; }
  return results;
}


export function calculateLevel_of_service_calculator(input: Level_of_service_calculatorInput): Level_of_service_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cslPercent"] ?? 0;
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


export interface Level_of_service_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
