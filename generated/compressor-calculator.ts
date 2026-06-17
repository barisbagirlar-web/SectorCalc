// @ts-nocheck
// Auto-generated from compressor-calculator-schema.json
import * as z from 'zod';

export interface Compressor_calculatorInput {
  inletPressure: number;
  outletPressure: number;
  flowRate: number;
  adiabaticIndex: number;
  compressorEfficiency: number;
  motorEfficiency: number;
}

export const Compressor_calculatorInputSchema = z.object({
  inletPressure: z.number().default(1),
  outletPressure: z.number().default(8),
  flowRate: z.number().default(10),
  adiabaticIndex: z.number().default(1.4),
  compressorEfficiency: z.number().default(80),
  motorEfficiency: z.number().default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressor_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.outletPressure / input.inletPressure; results["pressureRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressureRatio"] = 0; }
  try { const v = input.outletPressure / input.inletPressure; results["pressureRatio_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressureRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompressor_calculator(input: Compressor_calculatorInput): Compressor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressureRatio"]);
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


export interface Compressor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
