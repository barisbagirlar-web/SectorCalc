// Auto-generated from critical-speed-calculator-schema.json
import * as z from 'zod';

export interface Critical_speed_calculatorInput {
  shaftLength: number;
  shaftDiameter: number;
  youngsModulus: number;
  density: number;
  supportFactor: number;
}

export const Critical_speed_calculatorInputSchema = z.object({
  shaftLength: z.number().default(1),
  shaftDiameter: z.number().default(0.05),
  youngsModulus: z.number().default(210000000000),
  density: z.number().default(7850),
  supportFactor: z.number().default(3.141592653589793),
});

function evaluateAllFormulas(input: Critical_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.shaftDiameter/2) ** 2; results["crossSectionArea"] = Number.isFinite(v) ? v : 0; } catch { results["crossSectionArea"] = 0; }
  try { const v = Math.PI/64 * input.shaftDiameter ** 4; results["momentOfInertia"] = Number.isFinite(v) ? v : 0; } catch { results["momentOfInertia"] = 0; }
  try { const v = input.density * (results["crossSectionArea"] ?? 0); results["massPerUnitLength"] = Number.isFinite(v) ? v : 0; } catch { results["massPerUnitLength"] = 0; }
  try { const v = (input.supportFactor / input.shaftLength) ** 2 * Math.sqrt(input.youngsModulus * (results["momentOfInertia"] ?? 0) / (results["massPerUnitLength"] ?? 0)); results["angularFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["angularFrequency"] = 0; }
  try { const v = (results["angularFrequency"] ?? 0) * 30 / Math.PI; results["criticalSpeedRPM"] = Number.isFinite(v) ? v : 0; } catch { results["criticalSpeedRPM"] = 0; }
  return results;
}


export function calculateCritical_speed_calculator(input: Critical_speed_calculatorInput): Critical_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["criticalSpeedRPM"] ?? 0;
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


export interface Critical_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
