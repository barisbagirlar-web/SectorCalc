// Auto-generated from conduction-calculator-schema.json
import * as z from 'zod';

export interface Conduction_calculatorInput {
  thermalConductivity: number;
  area: number;
  hotTemp: number;
  coldTemp: number;
  thickness: number;
}

export const Conduction_calculatorInputSchema = z.object({
  thermalConductivity: z.number().default(0.04),
  area: z.number().default(1),
  hotTemp: z.number().default(100),
  coldTemp: z.number().default(20),
  thickness: z.number().default(0.1),
});

function evaluateAllFormulas(input: Conduction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.thermalConductivity * input.area * (input.hotTemp - input.coldTemp)) / input.thickness; results["heatTransferRate"] = Number.isFinite(v) ? v : 0; } catch { results["heatTransferRate"] = 0; }
  try { const v = input.thickness / (input.thermalConductivity * input.area); results["thermalResistance"] = Number.isFinite(v) ? v : 0; } catch { results["thermalResistance"] = 0; }
  try { const v = (input.thermalConductivity * (input.hotTemp - input.coldTemp)) / input.thickness; results["heatFlux"] = Number.isFinite(v) ? v : 0; } catch { results["heatFlux"] = 0; }
  return results;
}


export function calculateConduction_calculator(input: Conduction_calculatorInput): Conduction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["heatTransferRate"] ?? 0;
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


export interface Conduction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
