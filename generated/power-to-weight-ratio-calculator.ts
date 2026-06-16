// Auto-generated from power-to-weight-ratio-calculator-schema.json
import * as z from 'zod';

export interface Power_to_weight_ratio_calculatorInput {
  enginePowerkW: number;
  vehicleMassKg: number;
  drivetrainEfficiencyPercent: number;
  payloadKg: number;
}

export const Power_to_weight_ratio_calculatorInputSchema = z.object({
  enginePowerkW: z.number().default(100),
  vehicleMassKg: z.number().default(1200),
  drivetrainEfficiencyPercent: z.number().default(85),
  payloadKg: z.number().default(200),
});

function evaluateAllFormulas(input: Power_to_weight_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.enginePowerkW * (input.drivetrainEfficiencyPercent / 100); results["effectivePower"] = Number.isFinite(v) ? v : 0; } catch { results["effectivePower"] = 0; }
  try { const v = input.vehicleMassKg + input.payloadKg; results["totalMass"] = Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (input.enginePowerkW * (input.drivetrainEfficiencyPercent / 100)) / (input.vehicleMassKg + input.payloadKg); results["powerToWeightRatio"] = Number.isFinite(v) ? v : 0; } catch { results["powerToWeightRatio"] = 0; }
  return results;
}


export function calculatePower_to_weight_ratio_calculator(input: Power_to_weight_ratio_calculatorInput): Power_to_weight_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["powerToWeightRatio"] ?? 0;
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


export interface Power_to_weight_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
