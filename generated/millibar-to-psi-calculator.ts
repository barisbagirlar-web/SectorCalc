// Auto-generated from millibar-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Millibar_to_psi_calculatorInput {
  millibarValue: number;
  conversionFactor: number;
  calibrationOffset: number;
  temperatureCorrection: number;
  dataConfidence?: number;
}

export const Millibar_to_psi_calculatorInputSchema = z.object({
  millibarValue: z.number().default(0),
  conversionFactor: z.number().default(0.0145037738),
  calibrationOffset: z.number().default(0),
  temperatureCorrection: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Millibar_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.millibarValue * input.conversionFactor; results["rawConversionPsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawConversionPsi"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawConversionPsi"])) + input.calibrationOffset; results["calibrationAppliedPsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["calibrationAppliedPsi"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["calibrationAppliedPsi"])) * input.temperatureCorrection; results["finalPressurePsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalPressurePsi"] = Number.NaN; }
  return results;
}


export function calculateMillibar_to_psi_calculator(input: Millibar_to_psi_calculatorInput): Millibar_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalPressurePsi"]);
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


export interface Millibar_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
