// Auto-generated from reflection-calculator-schema.json
import * as z from 'zod';

export interface Reflection_calculatorInput {
  incidentAngle: number;
  n1: number;
  n2: number;
  wavelength: number;
}

export const Reflection_calculatorInputSchema = z.object({
  incidentAngle: z.number().default(30),
  n1: z.number().default(1),
  n2: z.number().default(1.5),
  wavelength: z.number().default(550),
});

function evaluateAllFormulas(input: Reflection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.incidentAngle * Math.PI / 180; results["theta1"] = Number.isFinite(v) ? v : 0; } catch { results["theta1"] = 0; }
  try { const v = input.n1 * Math.sin((results["theta1"] ?? 0)) / input.n2; results["sinTheta2"] = Number.isFinite(v) ? v : 0; } catch { results["sinTheta2"] = 0; }
  try { const v = ((results["sinTheta2"] ?? 0) <= 1 && (results["sinTheta2"] ?? 0) >= -1) ? Math.asin((results["sinTheta2"] ?? 0)) : null; results["theta2"] = Number.isFinite(v) ? v : 0; } catch { results["theta2"] = 0; }
  try { const v = ((results["theta2"] ?? 0) !== null) ? Math.round(Math.pow((input.n1*Math.cos((results["theta1"] ?? 0)) - input.n2*Math.cos((results["theta2"] ?? 0)))/(input.n1*Math.cos((results["theta1"] ?? 0)) + input.n2*Math.cos((results["theta2"] ?? 0))), 2) * 10000) / 100 : 100; results["rs"] = Number.isFinite(v) ? v : 0; } catch { results["rs"] = 0; }
  try { const v = ((results["theta2"] ?? 0) !== null) ? Math.round(Math.pow((input.n1*Math.cos((results["theta2"] ?? 0)) - input.n2*Math.cos((results["theta1"] ?? 0)))/(input.n1*Math.cos((results["theta2"] ?? 0)) + input.n2*Math.cos((results["theta1"] ?? 0))), 2) * 10000) / 100 : 100; results["rp"] = Number.isFinite(v) ? v : 0; } catch { results["rp"] = 0; }
  try { const v = ((results["theta2"] ?? 0) !== null) ? Math.round((((results["rs"] ?? 0) + (results["rp"] ?? 0)) / 2) * 100) / 100 : 100; results["averageReflectance"] = Number.isFinite(v) ? v : 0; } catch { results["averageReflectance"] = 0; }
  return results;
}


export function calculateReflection_calculator(input: Reflection_calculatorInput): Reflection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Average"] ?? 0;
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


export interface Reflection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
