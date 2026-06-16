// Auto-generated from glasses-prescription-calculator-schema.json
import * as z from 'zod';

export interface Glasses_prescription_calculatorInput {
  sphere: number;
  cylinder: number;
  axis: number;
  vertexDistance: number;
}

export const Glasses_prescription_calculatorInputSchema = z.object({
  sphere: z.number().default(0),
  cylinder: z.number().default(0),
  axis: z.number().default(0),
  vertexDistance: z.number().default(12),
});

function evaluateAllFormulas(input: Glasses_prescription_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vertexDistance / 1000; results["d"] = Number.isFinite(v) ? v : 0; } catch { results["d"] = 0; }
  try { const v = input.sphere; results["S1"] = Number.isFinite(v) ? v : 0; } catch { results["S1"] = 0; }
  try { const v = input.sphere + input.cylinder; results["S2"] = Number.isFinite(v) ? v : 0; } catch { results["S2"] = 0; }
  try { const v = (results["S1"] ?? 0) / (1 - (results["d"] ?? 0) * (results["S1"] ?? 0)); results["S1_eff"] = Number.isFinite(v) ? v : 0; } catch { results["S1_eff"] = 0; }
  try { const v = (results["S2"] ?? 0) / (1 - (results["d"] ?? 0) * (results["S2"] ?? 0)); results["S2_eff"] = Number.isFinite(v) ? v : 0; } catch { results["S2_eff"] = 0; }
  try { const v = (results["S1_eff"] ?? 0); results["newSphere"] = Number.isFinite(v) ? v : 0; } catch { results["newSphere"] = 0; }
  try { const v = (results["S2_eff"] ?? 0) - (results["S1_eff"] ?? 0); results["newCylinder"] = Number.isFinite(v) ? v : 0; } catch { results["newCylinder"] = 0; }
  try { const v = input.axis; results["newAxis"] = Number.isFinite(v) ? v : 0; } catch { results["newAxis"] = 0; }
  return results;
}


export function calculateGlasses_prescription_calculator(input: Glasses_prescription_calculatorInput): Glasses_prescription_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Effective"] ?? 0;
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


export interface Glasses_prescription_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
