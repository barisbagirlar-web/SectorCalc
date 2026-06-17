// @ts-nocheck
// Auto-generated from candy-temperature-calculator-schema.json
import * as z from 'zod';

export interface Candy_temperature_calculatorInput {
  stageIndex: number;
  altitudeFt: number;
  customTempF: number;
  thermometerOffsetF: number;
}

export const Candy_temperature_calculatorInputSchema = z.object({
  stageIndex: z.number().default(6),
  altitudeFt: z.number().default(0),
  customTempF: z.number().default(300),
  thermometerOffsetF: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Candy_temperature_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = -(input.altitudeFt / 500); results["altitudeAdjustment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["altitudeAdjustment"] = 0; }
  try { const v = -(input.altitudeFt / 500); results["altitudeAdjustment_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["altitudeAdjustment_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCandy_temperature_calculator(input: Candy_temperature_calculatorInput): Candy_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["altitudeAdjustment_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Candy_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
