// Auto-generated from power-to-weight-ratio-calculator-schema.json
import * as z from 'zod';

export interface Power_to_weight_ratio_calculatorInput {
  enginePowerkW: number;
  vehicleMassKg: number;
  drivetrainEfficiencyPercent: number;
  payloadKg: number;
  dataConfidence?: number;
}

export const Power_to_weight_ratio_calculatorInputSchema = z.object({
  enginePowerkW: z.number().default(100),
  vehicleMassKg: z.number().default(1200),
  drivetrainEfficiencyPercent: z.number().default(85),
  payloadKg: z.number().default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Power_to_weight_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.enginePowerkW * (input.drivetrainEfficiencyPercent / 100); results["effectivePower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectivePower"] = Number.NaN; }
  try { const v = input.vehicleMassKg + input.payloadKg; results["totalMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMass"] = Number.NaN; }
  try { const v = (input.enginePowerkW * (input.drivetrainEfficiencyPercent / 100)) / (input.vehicleMassKg + input.payloadKg); results["powerToWeightRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerToWeightRatio"] = Number.NaN; }
  return results;
}


export function calculatePower_to_weight_ratio_calculator(input: Power_to_weight_ratio_calculatorInput): Power_to_weight_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerToWeightRatio"]);
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


export interface Power_to_weight_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
