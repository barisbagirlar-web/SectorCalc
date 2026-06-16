// Auto-generated from torr-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Torr_to_psi_calculatorInput {
  torrValue: number;
  conversionFactor: number;
  decimalPlaces: number;
  offset: number;
}

export const Torr_to_psi_calculatorInputSchema = z.object({
  torrValue: z.number().default(760),
  conversionFactor: z.number().default(0.01933677),
  decimalPlaces: z.number().default(4),
  offset: z.number().default(0),
});

function evaluateAllFormulas(input: Torr_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.torrValue * input.conversionFactor; results["intermediatePsi"] = Number.isFinite(v) ? v : 0; } catch { results["intermediatePsi"] = 0; }
  try { const v = input.torrValue * input.conversionFactor + input.offset; results["adjustedPsi"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedPsi"] = 0; }
  try { const v = Math.round((input.torrValue * input.conversionFactor + input.offset) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedPsi"] = Number.isFinite(v) ? v : 0; } catch { results["roundedPsi"] = 0; }
  return results;
}


export function calculateTorr_to_psi_calculator(input: Torr_to_psi_calculatorInput): Torr_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedPsi"] ?? 0;
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


export interface Torr_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
