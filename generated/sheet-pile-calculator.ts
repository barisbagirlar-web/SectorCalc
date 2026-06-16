// Auto-generated from sheet-pile-calculator-schema.json
import * as z from 'zod';

export interface Sheet_pile_calculatorInput {
  pileLength: number;
  pileWidth: number;
  numberOfPiles: number;
  steelDensity: number;
  unitCost: number;
  installationCostPerPile: number;
}

export const Sheet_pile_calculatorInputSchema = z.object({
  pileLength: z.number().default(12),
  pileWidth: z.number().default(0.5),
  numberOfPiles: z.number().default(100),
  steelDensity: z.number().default(7850),
  unitCost: z.number().default(1.2),
  installationCostPerPile: z.number().default(50),
});

function evaluateAllFormulas(input: Sheet_pile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pileLength * input.pileWidth * input.numberOfPiles * 0.01; results["totalSteelVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalSteelVolume"] = 0; }
  try { const v = (results["totalSteelVolume"] ?? 0) * input.steelDensity; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * input.unitCost; results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.numberOfPiles * input.installationCostPerPile; results["installationCost"] = Number.isFinite(v) ? v : 0; } catch { results["installationCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + (results["installationCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSheet_pile_calculator(input: Sheet_pile_calculatorInput): Sheet_pile_calculatorOutput {
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


export interface Sheet_pile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
