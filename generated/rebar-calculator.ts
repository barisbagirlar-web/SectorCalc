// Auto-generated from rebar-calculator-schema.json
import * as z from 'zod';

export interface Rebar_calculatorInput {
  diameter: number;
  lengthPerBar: number;
  numberOfBars: number;
  lapLength: number;
  wastagePercent: number;
  weightPerMeter: number;
  dataConfidence?: number;
}

export const Rebar_calculatorInputSchema = z.object({
  diameter: z.number().default(12),
  lengthPerBar: z.number().default(12),
  numberOfBars: z.number().default(10),
  lapLength: z.number().default(0),
  wastagePercent: z.number().default(5),
  weightPerMeter: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rebar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength); results["totalLengthM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLengthM"] = 0; }
  try { const v = input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0); results["weightPerMeterUsed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightPerMeterUsed"] = 0; }
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength) * (input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0)); results["netWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWeightKg"] = 0; }
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength) * (input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0)) * input.wastagePercent / 100; results["wastageWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wastageWeightKg"] = 0; }
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength) * (input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0)) * (1 + input.wastagePercent / 100); results["totalWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightKg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRebar_calculator(input: Rebar_calculatorInput): Rebar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalWeightKg"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Rebar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
