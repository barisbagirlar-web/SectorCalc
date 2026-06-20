// Auto-generated from candy-temperature-calculator-schema.json
import * as z from 'zod';

export interface Candy_temperature_calculatorInput {
  stageIndex: number;
  altitudeFt: number;
  customTempF: number;
  thermometerOffsetF: number;
  dataConfidence?: number;
}

export const Candy_temperature_calculatorInputSchema = z.object({
  stageIndex: z.number().default(6),
  altitudeFt: z.number().default(0),
  customTempF: z.number().default(300),
  thermometerOffsetF: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Candy_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.stageIndex) * (input.altitudeFt) * (input.customTempF) * (input.thermometerOffsetF); results["altitudeAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["altitudeAdjustment"] = Number.NaN; }
  try { const v = (input.stageIndex) * (input.altitudeFt) * (input.customTempF); results["altitudeAdjustment_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["altitudeAdjustment_aux"] = Number.NaN; }
  return results;
}


export function calculateCandy_temperature_calculator(input: Candy_temperature_calculatorInput): Candy_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["altitudeAdjustment_aux"]);
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


export interface Candy_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
