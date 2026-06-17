// @ts-nocheck
// Auto-generated from deload-calculator-schema.json
import * as z from 'zod';

export interface Deload_calculatorInput {
  currentTrainingMax: number;
  currentIntensity: number;
  currentVolume: number;
  deloadDuration: number;
  deloadIntensityReduction: number;
  deloadVolumeReduction: number;
}

export const Deload_calculatorInputSchema = z.object({
  currentTrainingMax: z.number().default(100),
  currentIntensity: z.number().default(80),
  currentVolume: z.number().default(5000),
  deloadDuration: z.number().default(1),
  deloadIntensityReduction: z.number().default(10),
  deloadVolumeReduction: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deload_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentIntensity - input.deloadIntensityReduction; results["deloadIntensity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deloadIntensity"] = 0; }
  try { const v = input.currentVolume * (1 - input.deloadVolumeReduction / 100); results["deloadVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deloadVolume"] = 0; }
  try { const v = input.currentTrainingMax * ((asFormulaNumber(results["deloadIntensity"])) / 100); results["deloadWorkingWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deloadWorkingWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeload_calculator(input: Deload_calculatorInput): Deload_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deloadWorkingWeight"]);
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


export interface Deload_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
