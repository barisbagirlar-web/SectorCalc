// Auto-generated from refraction-calculator-schema.json
import * as z from 'zod';

export interface Refraction_calculatorInput {
  incidentAngle: number;
  refractiveIndex1: number;
  refractiveIndex2: number;
  thickness: number;
}

export const Refraction_calculatorInputSchema = z.object({
  incidentAngle: z.number().default(30),
  refractiveIndex1: z.number().default(1),
  refractiveIndex2: z.number().default(1.5),
  thickness: z.number().default(10),
});

function evaluateAllFormulas(input: Refraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.asin(input.refractiveIndex1 * Math.sin(input.incidentAngle * Math.PI / 180) / input.refractiveIndex2) * 180 / Math.PI; results["refractedAngle"] = Number.isFinite(v) ? v : 0; } catch { results["refractedAngle"] = 0; }
  try { const v = input.refractiveIndex1 > input.refractiveIndex2 ? Math.asin(input.refractiveIndex2 / input.refractiveIndex1) * 180 / Math.PI : null; results["criticalAngle"] = Number.isFinite(v) ? v : 0; } catch { results["criticalAngle"] = 0; }
  try { const v = input.thickness * Math.sin((input.incidentAngle * Math.PI / 180) - Math.asin(input.refractiveIndex1 * Math.sin(input.incidentAngle * Math.PI / 180) / input.refractiveIndex2)) / Math.cos(Math.asin(input.refractiveIndex1 * Math.sin(input.incidentAngle * Math.PI / 180) / input.refractiveIndex2)); results["lateralShift"] = Number.isFinite(v) ? v : 0; } catch { results["lateralShift"] = 0; }
  return results;
}


export function calculateRefraction_calculator(input: Refraction_calculatorInput): Refraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["refractedAngle"] ?? 0;
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


export interface Refraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
