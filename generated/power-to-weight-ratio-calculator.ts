// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Power_to_weight_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.enginePowerkW * (input.drivetrainEfficiencyPercent / 100); results["effectivePower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectivePower"] = 0; }
  try { const v = input.vehicleMassKg + input.payloadKg; results["totalMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (input.enginePowerkW * (input.drivetrainEfficiencyPercent / 100)) / (input.vehicleMassKg + input.payloadKg); results["powerToWeightRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerToWeightRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePower_to_weight_ratio_calculator(input: Power_to_weight_ratio_calculatorInput): Power_to_weight_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerToWeightRatio"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
