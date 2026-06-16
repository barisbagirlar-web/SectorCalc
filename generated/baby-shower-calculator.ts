// Auto-generated from baby-shower-calculator-schema.json
import * as z from 'zod';

export interface Baby_shower_calculatorInput {
  numParts: number;
  flowRate: number;
  cycleTime: number;
  chemicalCostPerLiter: number;
  waterCostPerLiter: number;
}

export const Baby_shower_calculatorInputSchema = z.object({
  numParts: z.number().default(100),
  flowRate: z.number().default(10),
  cycleTime: z.number().default(5),
  chemicalCostPerLiter: z.number().default(0.5),
  waterCostPerLiter: z.number().default(0.002),
});

function evaluateAllFormulas(input: Baby_shower_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate * input.cycleTime; results["totalWaterPerBatch"] = Number.isFinite(v) ? v : 0; } catch { results["totalWaterPerBatch"] = 0; }
  try { const v = (results["totalWaterPerBatch"] ?? 0) * input.waterCostPerLiter; results["totalWaterCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalWaterCost"] = 0; }
  try { const v = (results["totalWaterPerBatch"] ?? 0) * input.chemicalCostPerLiter; results["totalChemicalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalChemicalCost"] = 0; }
  try { const v = (results["totalWaterCost"] ?? 0) + (results["totalChemicalCost"] ?? 0); results["totalCostPerBatch"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerBatch"] = 0; }
  try { const v = (results["totalCostPerBatch"] ?? 0) / input.numParts; results["costPerPiece"] = Number.isFinite(v) ? v : 0; } catch { results["costPerPiece"] = 0; }
  return results;
}


export function calculateBaby_shower_calculator(input: Baby_shower_calculatorInput): Baby_shower_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerPiece"] ?? 0;
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


export interface Baby_shower_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
