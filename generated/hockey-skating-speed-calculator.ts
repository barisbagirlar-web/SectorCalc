// @ts-nocheck
// Auto-generated from hockey-skating-speed-calculator-schema.json
import * as z from 'zod';

export interface Hockey_skating_speed_calculatorInput {
  distance: number;
  time: number;
  strideLength: number;
  strideFrequency: number;
}

export const Hockey_skating_speed_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  time: z.number().default(10),
  strideLength: z.number().default(1.5),
  strideFrequency: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hockey_skating_speed_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance / input.time; results["speedMS"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedMS"] = 0; }
  try { const v = (input.distance / input.time) * 3.6; results["speedKMH"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedKMH"] = 0; }
  try { const v = input.strideLength * input.strideFrequency; results["strideSpeedMS"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["strideSpeedMS"] = 0; }
  try { const v = input.strideLength * input.strideFrequency * 3.6; results["strideSpeedKMH"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["strideSpeedKMH"] = 0; }
  try { const v = (input.strideLength * input.strideFrequency - input.distance / input.time) / (input.distance / input.time) * 100; results["speedDiffPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedDiffPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHockey_skating_speed_calculator(input: Hockey_skating_speed_calculatorInput): Hockey_skating_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speedMS"]);
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


export interface Hockey_skating_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
