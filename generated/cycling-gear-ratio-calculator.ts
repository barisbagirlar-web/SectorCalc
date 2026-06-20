// Auto-generated from cycling-gear-ratio-calculator-schema.json
import * as z from 'zod';

export interface Cycling_gear_ratio_calculatorInput {
  chainringTeeth: number;
  cassetteTeeth: number;
  wheelDiameter: number;
  cadence: number;
  dataConfidence?: number;
}

export const Cycling_gear_ratio_calculatorInputSchema = z.object({
  chainringTeeth: z.number().default(50),
  cassetteTeeth: z.number().default(12),
  wheelDiameter: z.number().default(700),
  cadence: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cycling_gear_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chainringTeeth / input.cassetteTeeth; results["gearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearRatio"] = Number.NaN; }
  try { const v = (input.chainringTeeth / input.cassetteTeeth) * (input.wheelDiameter / 25.4); results["gearInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearInches"] = Number.NaN; }
  try { const v = (Math.PI * input.wheelDiameter / 1000) * (input.chainringTeeth / input.cassetteTeeth); results["development"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["development"] = Number.NaN; }
  try { const v = (Math.PI * input.wheelDiameter * input.chainringTeeth * input.cadence * 60) / (input.cassetteTeeth * 1000000); results["speedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedKmh"] = Number.NaN; }
  try { const v = (input.chainringTeeth / input.cassetteTeeth) * (input.wheelDiameter / 25.4) * Math.PI * input.cadence * 60 / 63360; results["speedMph"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedMph"] = Number.NaN; }
  return results;
}


export function calculateCycling_gear_ratio_calculator(input: Cycling_gear_ratio_calculatorInput): Cycling_gear_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speedMph"]);
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


export interface Cycling_gear_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
