// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cox_proportional_hazards_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.operatingHours * input.temperature * input.vibration * input.maintenanceScore; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.operatingHours * input.temperature * input.vibration * input.maintenanceScore * (input.beta_hours * input.beta_temp * input.beta_vibration * input.beta_maintenance); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.beta_hours * input.beta_temp * input.beta_vibration * input.beta_maintenance; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCox_proportional_hazards_calculator(input: Cox_proportional_hazards_calculatorInput): Cox_proportional_hazards_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cox_proportional_hazards_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
