// Auto-generated from bar-to-atm-calculator-schema.json
import * as z from 'zod';

export interface Bar_to_atm_calculatorInput {
  pressure_bar: number;
  calibration_offset_bar: number;
  uncertainty_percent: number;
  decimal_places: number;
}

export const Bar_to_atm_calculatorInputSchema = z.object({
  pressure_bar: z.number().default(1),
  calibration_offset_bar: z.number().default(0),
  uncertainty_percent: z.number().default(0),
  decimal_places: z.number().default(4),
});

function evaluateAllFormulas(input: Bar_to_atm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.pressure_bar + input.calibration_offset_bar) * 0.9869232667160128).toFixed(input.decimal_places); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateBar_to_atm_calculator(input: Bar_to_atm_calculatorInput): Bar_to_atm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Converted"] ?? 0;
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


export interface Bar_to_atm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
