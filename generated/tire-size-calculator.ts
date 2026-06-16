// Auto-generated from tire-size-calculator-schema.json
import * as z from 'zod';

export interface Tire_size_calculatorInput {
  tireWidth: number;
  aspectRatio: number;
  rimDiameter: number;
  treadLoss: number;
}

export const Tire_size_calculatorInputSchema = z.object({
  tireWidth: z.number().default(225),
  aspectRatio: z.number().default(45),
  rimDiameter: z.number().default(17),
  treadLoss: z.number().default(0),
});

function evaluateAllFormulas(input: Tire_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tireWidth * input.aspectRatio / 100) - input.treadLoss; results["sidewallHeightMm"] = Number.isFinite(v) ? v : 0; } catch { results["sidewallHeightMm"] = 0; }
  try { const v = (results["sidewallHeightMm"] ?? 0) / 25.4; results["sidewallHeightIn"] = Number.isFinite(v) ? v : 0; } catch { results["sidewallHeightIn"] = 0; }
  try { const v = input.rimDiameter + 2 * (results["sidewallHeightIn"] ?? 0); results["overallDiameterIn"] = Number.isFinite(v) ? v : 0; } catch { results["overallDiameterIn"] = 0; }
  try { const v = (results["overallDiameterIn"] ?? 0) * 25.4; results["overallDiameterMm"] = Number.isFinite(v) ? v : 0; } catch { results["overallDiameterMm"] = 0; }
  try { const v = Math.PI * (results["overallDiameterIn"] ?? 0); results["circumferenceIn"] = Number.isFinite(v) ? v : 0; } catch { results["circumferenceIn"] = 0; }
  try { const v = Math.PI * (results["overallDiameterMm"] ?? 0); results["circumferenceMm"] = Number.isFinite(v) ? v : 0; } catch { results["circumferenceMm"] = 0; }
  return results;
}


export function calculateTire_size_calculator(input: Tire_size_calculatorInput): Tire_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallDiameterIn"] ?? 0;
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


export interface Tire_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
