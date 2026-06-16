// Auto-generated from bsfc-calculator-schema.json
import * as z from 'zod';

export interface Bsfc_calculatorInput {
  fuelVolumeFlow: number;
  fuelTemperature: number;
  fuelDensityRef: number;
  power: number;
  thermalExpansionCoeff: number;
}

export const Bsfc_calculatorInputSchema = z.object({
  fuelVolumeFlow: z.number().default(0),
  fuelTemperature: z.number().default(20),
  fuelDensityRef: z.number().default(0.84),
  power: z.number().default(0),
  thermalExpansionCoeff: z.number().default(0.00095),
});

function evaluateAllFormulas(input: Bsfc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelDensityRef / (1 + input.thermalExpansionCoeff * (input.fuelTemperature - 15)); results["densityCorrected"] = Number.isFinite(v) ? v : 0; } catch { results["densityCorrected"] = 0; }
  try { const v = input.fuelVolumeFlow * (results["densityCorrected"] ?? 0); results["massFlow"] = Number.isFinite(v) ? v : 0; } catch { results["massFlow"] = 0; }
  try { const v = ((results["massFlow"] ?? 0) * 1000) / input.power; results["bsfc"] = Number.isFinite(v) ? v : 0; } catch { results["bsfc"] = 0; }
  try { const v = (results["bsfc"] ?? 0) * 0.001644; results["bsfc_lb_hph"] = Number.isFinite(v) ? v : 0; } catch { results["bsfc_lb_hph"] = 0; }
  return results;
}


export function calculateBsfc_calculator(input: Bsfc_calculatorInput): Bsfc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bsfc"] ?? 0;
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


export interface Bsfc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
