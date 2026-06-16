// Auto-generated from race-time-predictor-calculator-schema.json
import * as z from 'zod';

export interface Race_time_predictor_calculatorInput {
  d1: number;
  t1: number;
  d2: number;
  fatigue: number;
}

export const Race_time_predictor_calculatorInputSchema = z.object({
  d1: z.number().default(10),
  t1: z.number().default(50),
  d2: z.number().default(21.1),
  fatigue: z.number().default(1.06),
});

function evaluateAllFormulas(input: Race_time_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.t1 * Math.pow(input.d2/input.d1, input.fatigue); results["t2_min"] = Number.isFinite(v) ? v : 0; } catch { results["t2_min"] = 0; }
  try { const v = (results["t2_min"] ?? 0) / input.d2; results["pace_min"] = Number.isFinite(v) ? v : 0; } catch { results["pace_min"] = 0; }
  try { const v = String(Math.floor((results["t2_min"] ?? 0)/60)).padStart(2,'0') + ':' + String(Math.floor((results["t2_min"] ?? 0)%60)).padStart(2,'0') + ':' + String(Math.round(((results["t2_min"] ?? 0)%1)*60)).padStart(2,'0'); results["t2_formatted"] = Number.isFinite(v) ? v : 0; } catch { results["t2_formatted"] = 0; }
  try { const v = String(Math.floor((results["pace_min"] ?? 0))).padStart(2,'0') + ':' + String(Math.round(((results["pace_min"] ?? 0)%1)*60)).padStart(2,'0'); results["pace_formatted"] = Number.isFinite(v) ? v : 0; } catch { results["pace_formatted"] = 0; }
  return results;
}


export function calculateRace_time_predictor_calculator(input: Race_time_predictor_calculatorInput): Race_time_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["t2_min"] ?? 0;
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


export interface Race_time_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
