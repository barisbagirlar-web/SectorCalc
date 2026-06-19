// Auto-generated from pints-to-liters-schema.json
import * as z from 'zod';

export interface Pints_to_litersInput {
  pints: number;
  pintType: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Pints_to_litersInputSchema = z.object({
  pints: z.number().default(1),
  pintType: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pints_to_litersInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pintType === 1 ? input.pints * 0.473176473 : input.pintType === 2 ? input.pints * 0.550610471 : input.pints * 0.56826125; results["liters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["liters"] = 0; }
  try { const v = input.pintType === 1 ? input.pints * 0.473176473 : input.pintType === 2 ? input.pints * 0.550610471 : input.pints * 0.56826125; results["liters_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["liters_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePints_to_liters(input: Pints_to_litersInput): Pints_to_litersOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["liters"]);
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


export interface Pints_to_litersOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
