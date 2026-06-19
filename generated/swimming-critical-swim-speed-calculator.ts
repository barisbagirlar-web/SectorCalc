// Auto-generated from swimming-critical-swim-speed-calculator-schema.json
import * as z from 'zod';

export interface Swimming_critical_swim_speed_calculatorInput {
  distance1: number;
  time1: number;
  distance2: number;
  time2: number;
  dataConfidence?: number;
}

export const Swimming_critical_swim_speed_calculatorInputSchema = z.object({
  distance1: z.number().default(200),
  time1: z.number().default(150),
  distance2: z.number().default(400),
  time2: z.number().default(310),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Swimming_critical_swim_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.distance2 - input.distance1) / (input.time2 - input.time1); results["css_mps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["css_mps"] = 0; }
  try { const v = 100 / (asFormulaNumber(results["css_mps"])); results["pace_100m_s"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pace_100m_s"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSwimming_critical_swim_speed_calculator(input: Swimming_critical_swim_speed_calculatorInput): Swimming_critical_swim_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pace_100m_s"]);
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


export interface Swimming_critical_swim_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
