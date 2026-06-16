// Auto-generated from cox-proportional-hazards-calculator-schema.json
import * as z from 'zod';

export interface Cox_proportional_hazards_calculatorInput {
  operatingHours: number;
  temperature: number;
  vibration: number;
  maintenanceScore: number;
  beta_hours: number;
  beta_temp: number;
  beta_vibration: number;
  beta_maintenance: number;
}

export const Cox_proportional_hazards_calculatorInputSchema = z.object({
  operatingHours: z.number().default(1000),
  temperature: z.number().default(80),
  vibration: z.number().default(5),
  maintenanceScore: z.number().default(0.8),
  beta_hours: z.number().default(0.0001),
  beta_temp: z.number().default(0.03),
  beta_vibration: z.number().default(0.1),
  beta_maintenance: z.number().default(-0.5),
});

function evaluateAllFormulas(input: Cox_proportional_hazards_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beta_hours * input.operatingHours + input.beta_temp * input.temperature + input.beta_vibration * input.vibration + input.beta_maintenance * input.maintenanceScore; results["linearPredictor"] = Number.isFinite(v) ? v : 0; } catch { results["linearPredictor"] = 0; }
  try { const v = Math.exp(input.beta_hours * input.operatingHours + input.beta_temp * input.temperature + input.beta_vibration * input.vibration + input.beta_maintenance * input.maintenanceScore); results["hazardRatio"] = Number.isFinite(v) ? v : 0; } catch { results["hazardRatio"] = 0; }
  return results;
}


export function calculateCox_proportional_hazards_calculator(input: Cox_proportional_hazards_calculatorInput): Cox_proportional_hazards_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hazardRatio"] ?? 0;
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


export interface Cox_proportional_hazards_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
