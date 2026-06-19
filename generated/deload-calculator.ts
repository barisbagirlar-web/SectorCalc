// Auto-generated from deload-calculator-schema.json
import * as z from 'zod';

export interface Deload_calculatorInput {
  currentTrainingMax: number;
  currentIntensity: number;
  currentVolume: number;
  deloadDuration: number;
  deloadIntensityReduction: number;
  deloadVolumeReduction: number;
  dataConfidence?: number;
}

export const Deload_calculatorInputSchema = z.object({
  currentTrainingMax: z.number().default(100),
  currentIntensity: z.number().default(80),
  currentVolume: z.number().default(5000),
  deloadDuration: z.number().default(1),
  deloadIntensityReduction: z.number().default(10),
  deloadVolumeReduction: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deload_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentIntensity - input.deloadIntensityReduction; results["deloadIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deloadIntensity"] = 0; }
  try { const v = input.currentVolume * (1 - input.deloadVolumeReduction / 100); results["deloadVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deloadVolume"] = 0; }
  try { const v = input.currentTrainingMax * ((asFormulaNumber(results["deloadIntensity"])) / 100); results["deloadWorkingWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deloadWorkingWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDeload_calculator(input: Deload_calculatorInput): Deload_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["deloadWorkingWeight"]));
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


export interface Deload_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
