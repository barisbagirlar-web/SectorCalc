// Auto-generated from pressure-vessel-calculator-schema.json
import * as z from 'zod';

export interface Pressure_vessel_calculatorInput {
  pressure: number;
  diameter: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
}

export const Pressure_vessel_calculatorInputSchema = z.object({
  pressure: z.number().default(1.5),
  diameter: z.number().default(1000),
  allowableStress: z.number().default(138),
  jointEfficiency: z.number().default(0.85),
  corrosionAllowance: z.number().default(3),
});

function evaluateAllFormulas(input: Pressure_vessel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.pressure * (input.diameter / 2)) / (input.allowableStress * input.jointEfficiency - 0.6 * input.pressure)) + input.corrosionAllowance; results["requiredThickness"] = Number.isFinite(v) ? v : 0; } catch { results["requiredThickness"] = 0; }
  try { const v = ((input.pressure * (input.diameter / 2)) / (input.allowableStress * input.jointEfficiency - 0.6 * input.pressure)) + input.corrosionAllowance; results["hoopThickness"] = Number.isFinite(v) ? v : 0; } catch { results["hoopThickness"] = 0; }
  try { const v = ((input.pressure * (input.diameter / 2)) / (2 * input.allowableStress * input.jointEfficiency + 0.4 * input.pressure)) + input.corrosionAllowance; results["longitudinalThickness"] = Number.isFinite(v) ? v : 0; } catch { results["longitudinalThickness"] = 0; }
  return results;
}


export function calculatePressure_vessel_calculator(input: Pressure_vessel_calculatorInput): Pressure_vessel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredThickness"] ?? 0;
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


export interface Pressure_vessel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
