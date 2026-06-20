// Auto-generated from torr-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Torr_to_psi_calculatorInput {
  torrValue: number;
  conversionFactor: number;
  decimalPlaces: number;
  offset: number;
  dataConfidence?: number;
}

export const Torr_to_psi_calculatorInputSchema = z.object({
  torrValue: z.number().default(760),
  conversionFactor: z.number().default(0.01933677),
  decimalPlaces: z.number().default(4),
  offset: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Torr_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.torrValue * input.conversionFactor; results["intermediatePsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["intermediatePsi"] = Number.NaN; }
  try { const v = input.torrValue * input.conversionFactor + input.offset; results["adjustedPsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedPsi"] = Number.NaN; }
  return results;
}


export function calculateTorr_to_psi_calculator(input: Torr_to_psi_calculatorInput): Torr_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedPsi"]);
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


export interface Torr_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
