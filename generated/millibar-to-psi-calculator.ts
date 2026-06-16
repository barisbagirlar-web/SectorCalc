// Auto-generated from millibar-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Millibar_to_psi_calculatorInput {
  millibarValue: number;
  conversionFactor: number;
  calibrationOffset: number;
  temperatureCorrection: number;
}

export const Millibar_to_psi_calculatorInputSchema = z.object({
  millibarValue: z.number().default(0),
  conversionFactor: z.number().default(0.0145037738),
  calibrationOffset: z.number().default(0),
  temperatureCorrection: z.number().default(1),
});

function evaluateAllFormulas(input: Millibar_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.millibarValue * input.conversionFactor; results["rawConversionPsi"] = Number.isFinite(v) ? v : 0; } catch { results["rawConversionPsi"] = 0; }
  try { const v = (results["rawConversionPsi"] ?? 0) + input.calibrationOffset; results["calibrationAppliedPsi"] = Number.isFinite(v) ? v : 0; } catch { results["calibrationAppliedPsi"] = 0; }
  try { const v = (results["calibrationAppliedPsi"] ?? 0) * input.temperatureCorrection; results["finalPressurePsi"] = Number.isFinite(v) ? v : 0; } catch { results["finalPressurePsi"] = 0; }
  return results;
}


export function calculateMillibar_to_psi_calculator(input: Millibar_to_psi_calculatorInput): Millibar_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalPressurePsi"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
