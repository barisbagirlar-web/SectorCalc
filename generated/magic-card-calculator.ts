// Auto-generated from magic-card-calculator-schema.json
import * as z from 'zod';

export interface Magic_card_calculatorInput {
  cardLength: number;
  cardWidth: number;
  cardThickness: number;
  materialDensity: number;
  materialCostPerKg: number;
  wasteFactor: number;
  batchSize: number;
}

export const Magic_card_calculatorInputSchema = z.object({
  cardLength: z.number().default(85.6),
  cardWidth: z.number().default(54),
  cardThickness: z.number().default(0.76),
  materialDensity: z.number().default(1.35),
  materialCostPerKg: z.number().default(10),
  wasteFactor: z.number().default(5),
  batchSize: z.number().default(1000),
});

function evaluateAllFormulas(input: Magic_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cardLength * input.cardWidth) / 100; results["areaCm2"] = Number.isFinite(v) ? v : 0; } catch { results["areaCm2"] = 0; }
  try { const v = (results["areaCm2"] ?? 0) * (input.cardThickness / 10); results["volumeCm3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeCm3"] = 0; }
  try { const v = ((results["volumeCm3"] ?? 0) * input.materialDensity) / 1000; results["massKg"] = Number.isFinite(v) ? v : 0; } catch { results["massKg"] = 0; }
  try { const v = (results["massKg"] ?? 0) * input.materialCostPerKg; results["materialCostPerCard"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostPerCard"] = 0; }
  try { const v = (results["materialCostPerCard"] ?? 0) * (1 + (input.wasteFactor / 100)); results["effectiveCostPerCard"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveCostPerCard"] = 0; }
  try { const v = (results["effectiveCostPerCard"] ?? 0) - (results["materialCostPerCard"] ?? 0); results["wasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (results["effectiveCostPerCard"] ?? 0) * input.batchSize; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateMagic_card_calculator(input: Magic_card_calculatorInput): Magic_card_calculatorOutput {
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


export interface Magic_card_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
