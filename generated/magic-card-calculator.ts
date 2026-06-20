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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Magic_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cardLength * input.cardWidth) / 100; results["areaCm2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaCm2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["areaCm2"])) * (input.cardThickness / 10); results["volumeCm3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeCm3"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["volumeCm3"])) * input.materialDensity) / 1000; results["massKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massKg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["massKg"])) * input.materialCostPerKg; results["materialCostPerCard"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCostPerCard"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialCostPerCard"])) * (1 + (input.wasteFactor / 100)); results["effectiveCostPerCard"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveCostPerCard"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveCostPerCard"])) - (toNumericFormulaValue(results["materialCostPerCard"])); results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveCostPerCard"])) * input.batchSize; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateMagic_card_calculator(input: Magic_card_calculatorInput): Magic_card_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
