// Auto-generated from roofing-calculator-schema.json
import * as z from 'zod';

export interface Roofing_calculatorInput {
  roofLength: number;
  roofWidth: number;
  roofPitch: number;
  materialCostPerSqm: number;
  laborCostPerSqm: number;
  wasteFactor: number;
}

export const Roofing_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(8),
  roofPitch: z.number().default(30),
  materialCostPerSqm: z.number().default(50),
  laborCostPerSqm: z.number().default(30),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Roofing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofLength * input.roofWidth; results["flatArea"] = Number.isFinite(v) ? v : 0; } catch { results["flatArea"] = 0; }
  try { const v = input.roofPitch * Math.PI / 180; results["pitchRad"] = Number.isFinite(v) ? v : 0; } catch { results["pitchRad"] = 0; }
  try { const v = (results["flatArea"] ?? 0) / Math.cos((results["pitchRad"] ?? 0)); results["inclinedArea"] = Number.isFinite(v) ? v : 0; } catch { results["inclinedArea"] = 0; }
  try { const v = (results["inclinedArea"] ?? 0) * (1 + input.wasteFactor / 100); results["totalMaterialArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialArea"] = 0; }
  try { const v = (results["totalMaterialArea"] ?? 0) * input.materialCostPerSqm; results["totalMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = (results["inclinedArea"] ?? 0) * input.laborCostPerSqm; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (results["totalMaterialCost"] ?? 0) + (results["totalLaborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateRoofing_calculator(input: Roofing_calculatorInput): Roofing_calculatorOutput {
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


export interface Roofing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
