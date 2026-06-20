// Auto-generated from gallons-to-liters-schema.json
import * as z from 'zod';

export interface Gallons_to_litersInput {
  gallons: number;
  precision: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Gallons_to_litersInputSchema = z.object({
  gallons: z.number().default(1),
  precision: z.number().default(2),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gallons_to_litersInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gallons * 3.785411784; results["liters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["liters"] = Number.NaN; }
  try { const v = input.gallons * 3.785411784; results["liters_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["liters_aux"] = Number.NaN; }
  return results;
}


export function calculateGallons_to_liters(input: Gallons_to_litersInput): Gallons_to_litersOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["liters_aux"]);
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


export interface Gallons_to_litersOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
