// Auto-generated from jet-lag-calculator-schema.json
import * as z from 'zod';

export interface Jet_lag_calculatorInput {
  timeZonesCrossed: number;
  direction: number;
  flightDuration: number;
  preTravelRest: number;
  age: number;
  dataConfidence?: number;
}

export const Jet_lag_calculatorInputSchema = z.object({
  timeZonesCrossed: z.number().default(6),
  direction: z.number().default(1),
  flightDuration: z.number().default(8),
  preTravelRest: z.number().default(7),
  age: z.number().default(35),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Jet_lag_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeZonesCrossed * input.direction * input.flightDuration * input.preTravelRest; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.timeZonesCrossed * input.direction * input.flightDuration * input.preTravelRest * (input.age); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.age; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateJet_lag_calculator(input: Jet_lag_calculatorInput): Jet_lag_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Jet_lag_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
