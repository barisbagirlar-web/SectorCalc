// Auto-generated from baseball-bat-speed-calculator-schema.json
import * as z from 'zod';

export interface Baseball_bat_speed_calculatorInput {
  angularVelocity: number;
  batLength: number;
  pivotDistance: number;
  sweetSpotOffset: number;
  batMass: number;
  dataConfidence?: number;
}

export const Baseball_bat_speed_calculatorInputSchema = z.object({
  angularVelocity: z.number().default(1000),
  batLength: z.number().default(84),
  pivotDistance: z.number().default(10),
  sweetSpotOffset: z.number().default(15),
  batMass: z.number().default(900),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baseball_bat_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angularVelocity * Math.PI / 180; results["angularVelocityRadPerS"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["angularVelocityRadPerS"] = Number.NaN; }
  try { const v = (input.batLength - input.sweetSpotOffset - input.pivotDistance) / 100; results["effectiveRadiusM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRadiusM"] = Number.NaN; }
  try { const v = input.angularVelocity * Math.PI / 180 * (input.batLength - input.sweetSpotOffset - input.pivotDistance) / 100; results["batSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["batSpeed"] = Number.NaN; }
  return results;
}


export function calculateBaseball_bat_speed_calculator(input: Baseball_bat_speed_calculatorInput): Baseball_bat_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["batSpeed"]);
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


export interface Baseball_bat_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
