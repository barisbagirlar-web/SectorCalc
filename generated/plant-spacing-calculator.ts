// Auto-generated from plant-spacing-calculator-schema.json
import * as z from 'zod';

export interface Plant_spacing_calculatorInput {
  bedLength: number;
  bedWidth: number;
  plantSpacing: number;
  rowSpacing: number;
  edgeSpacing: number;
}

export const Plant_spacing_calculatorInputSchema = z.object({
  bedLength: z.number().default(10),
  bedWidth: z.number().default(5),
  plantSpacing: z.number().default(0.5),
  rowSpacing: z.number().default(0.5),
  edgeSpacing: z.number().default(0.25),
});

function evaluateAllFormulas(input: Plant_spacing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input.bedWidth - 2 * input.edgeSpacing) / input.rowSpacing) + 1; results["rows"] = Number.isFinite(v) ? v : 0; } catch { results["rows"] = 0; }
  try { const v = Math.floor((input.bedLength - 2 * input.edgeSpacing) / input.plantSpacing) + 1; results["plantsPerRow"] = Number.isFinite(v) ? v : 0; } catch { results["plantsPerRow"] = 0; }
  try { const v = (results["rows"] ?? 0) * (results["plantsPerRow"] ?? 0); results["totalPlants"] = Number.isFinite(v) ? v : 0; } catch { results["totalPlants"] = 0; }
  return results;
}


export function calculatePlant_spacing_calculator(input: Plant_spacing_calculatorInput): Plant_spacing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPlants"] ?? 0;
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


export interface Plant_spacing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
