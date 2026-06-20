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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rebar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength); results["totalLengthM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLengthM"] = Number.NaN; }
  try { const v = input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0); results["weightPerMeterUsed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightPerMeterUsed"] = Number.NaN; }
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength) * (input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0)); results["netWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netWeightKg"] = Number.NaN; }
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength) * (input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0)) * input.wastagePercent / 100; results["wastageWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastageWeightKg"] = Number.NaN; }
  try { const v = input.numberOfBars * (input.lengthPerBar + input.lapLength) * (input.weightPerMeter > 0 ? input.weightPerMeter : (input.diameter > 0 ? 0.006165 * input.diameter ** 2 : 0)) * (1 + input.wastagePercent / 100); results["totalWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeightKg"] = Number.NaN; }
  return results;
}


export function calculateRebar_calculator(input: Rebar_calculatorInput): Rebar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeightKg"]);
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


export interface Rebar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
