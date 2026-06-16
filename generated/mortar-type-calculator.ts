// Auto-generated from mortar-type-calculator-schema.json
import * as z from 'zod';

export interface Mortar_type_calculatorInput {
  design_strength: number;
  exposure_factor: number;
  reinforced: number;
  safety_factor: number;
}

export const Mortar_type_calculatorInputSchema = z.object({
  design_strength: z.number().default(5),
  exposure_factor: z.number().default(1.3),
  reinforced: z.number().default(0),
  safety_factor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Mortar_type_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.design_strength * input.exposure_factor * (input.reinforced ? 1.2 : 1) * input.safety_factor; results["required_strength"] = Number.isFinite(v) ? v : 0; } catch { results["required_strength"] = 0; }
  try { const v = ((results["required_strength"] ?? 0) >= 17.2) ? 'M' : ((results["required_strength"] ?? 0) >= 12.4) ? 'S' : ((results["required_strength"] ?? 0) >= 5.2) ? 'N' : ((results["required_strength"] ?? 0) >= 2.4) ? 'O' : 'K'; results["mortarType"] = Number.isFinite(v) ? v : 0; } catch { results["mortarType"] = 0; }
  try { const v = ((results["mortarType"] ?? 0) == 'M') ? 17.2 : ((results["mortarType"] ?? 0) == 'S') ? 12.4 : ((results["mortarType"] ?? 0) == 'N') ? 5.2 : ((results["mortarType"] ?? 0) == 'O') ? 2.4 : 0.5; results["min_strength"] = Number.isFinite(v) ? v : 0; } catch { results["min_strength"] = 0; }
  try { const v = (results["required_strength"] ?? 0) - (results["min_strength"] ?? 0); results["safety_margin"] = Number.isFinite(v) ? v : 0; } catch { results["safety_margin"] = 0; }
  return results;
}


export function calculateMortar_type_calculator(input: Mortar_type_calculatorInput): Mortar_type_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mortarType"] ?? 0;
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


export interface Mortar_type_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
