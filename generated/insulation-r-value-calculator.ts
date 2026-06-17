// Auto-generated from insulation-r-value-calculator-schema.json
import * as z from 'zod';

export interface Insulation_r_value_calculatorInput {
  thickness1: number;
  conductivity1: number;
  thickness2: number;
  conductivity2: number;
  thickness3: number;
  conductivity3: number;
  area: number;
  deltaT: number;
}

export const Insulation_r_value_calculatorInputSchema = z.object({
  thickness1: z.number().default(0.1),
  conductivity1: z.number().default(0.04),
  thickness2: z.number().default(0),
  conductivity2: z.number().default(0),
  thickness3: z.number().default(0),
  conductivity3: z.number().default(0),
  area: z.number().default(1),
  deltaT: z.number().default(20),
});

function evaluateAllFormulas(input: Insulation_r_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.thickness1 > 0 && input.conductivity1 > 0) ? input.thickness1 / input.conductivity1 : 0; results["r1"] = Number.isFinite(v) ? v : 0; } catch { results["r1"] = 0; }
  try { const v = (input.thickness2 > 0 && input.conductivity2 > 0) ? input.thickness2 / input.conductivity2 : 0; results["r2"] = Number.isFinite(v) ? v : 0; } catch { results["r2"] = 0; }
  try { const v = (input.thickness3 > 0 && input.conductivity3 > 0) ? input.thickness3 / input.conductivity3 : 0; results["r3"] = Number.isFinite(v) ? v : 0; } catch { results["r3"] = 0; }
  try { const v = (results["r1"] ?? 0) + (results["r2"] ?? 0) + (results["r3"] ?? 0); results["totalRValue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRValue"] = 0; }
  try { const v = (input.area * input.deltaT) / (results["totalRValue"] ?? 0); results["heatLoss"] = Number.isFinite(v) ? v : 0; } catch { results["heatLoss"] = 0; }
  return results;
}


export function calculateInsulation_r_value_calculator(input: Insulation_r_value_calculatorInput): Insulation_r_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["r1"] ?? 0;
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


export interface Insulation_r_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
