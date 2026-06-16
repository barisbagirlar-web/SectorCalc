// Auto-generated from sling-angle-calculator-schema.json
import * as z from 'zod';

export interface Sling_angle_calculatorInput {
  loadWeight: number;
  numberOfSlingLegs: number;
  slingAngle: number;
  safetyFactor: number;
  dynamicFactor: number;
  efficiencyFactor: number;
}

export const Sling_angle_calculatorInputSchema = z.object({
  loadWeight: z.number().default(1000),
  numberOfSlingLegs: z.number().default(2),
  slingAngle: z.number().default(30),
  safetyFactor: z.number().default(5),
  dynamicFactor: z.number().default(1.2),
  efficiencyFactor: z.number().default(0.8),
});

function evaluateAllFormulas(input: Sling_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slingAngle * Math.PI / 180; results["slingAngleRad"] = Number.isFinite(v) ? v : 0; } catch { results["slingAngleRad"] = 0; }
  try { const v = input.loadWeight / input.numberOfSlingLegs; results["baseLoadPerSling"] = Number.isFinite(v) ? v : 0; } catch { results["baseLoadPerSling"] = 0; }
  try { const v = (input.loadWeight * input.dynamicFactor) / (input.numberOfSlingLegs * input.efficiencyFactor * Math.cos((results["slingAngleRad"] ?? 0))); results["actualLoadPerSling"] = Number.isFinite(v) ? v : 0; } catch { results["actualLoadPerSling"] = 0; }
  try { const v = (results["actualLoadPerSling"] ?? 0) * input.safetyFactor; results["requiredBreakingStrength"] = Number.isFinite(v) ? v : 0; } catch { results["requiredBreakingStrength"] = 0; }
  return results;
}


export function calculateSling_angle_calculator(input: Sling_angle_calculatorInput): Sling_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actualLoadPerSling"] ?? 0;
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


export interface Sling_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
