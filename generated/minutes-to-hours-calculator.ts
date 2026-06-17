// Auto-generated from minutes-to-hours-calculator-schema.json
import * as z from 'zod';

export interface Minutes_to_hours_calculatorInput {
  inputMinutes: number;
  decPlaces: number;
  fmt: number;
  rndMode: number;
}

export const Minutes_to_hours_calculatorInputSchema = z.object({
  inputMinutes: z.number().default(60),
  decPlaces: z.number().default(2),
  fmt: z.number().default(0),
  rndMode: z.number().default(0),
});

function evaluateAllFormulas(input: Minutes_to_hours_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rndMode == 0 ? Math.round(input.inputMinutes/60 * Math.pow(10, input.decPlaces)) / Math.pow(10, input.decPlaces) : (input.rndMode == 1 ? Math.floor(input.inputMinutes/60 * Math.pow(10, input.decPlaces)) / Math.pow(10, input.decPlaces) : Math.ceil(input.inputMinutes/60 * Math.pow(10, input.decPlaces)) / Math.pow(10, input.decPlaces)); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.inputMinutes; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = hours; results["hours"] = Number.isFinite(v) ? v : 0; } catch { results["hours"] = 0; }
  try { const v = minutes; results["minutes"] = Number.isFinite(v) ? v : 0; } catch { results["minutes"] = 0; }
  return results;
}


export function calculateMinutes_to_hours_calculator(input: Minutes_to_hours_calculatorInput): Minutes_to_hours_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Minutes_to_hours_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
