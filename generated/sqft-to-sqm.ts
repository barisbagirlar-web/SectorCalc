// Auto-generated from sqft-to-sqm-schema.json
import * as z from 'zod';

export interface Sqft_to_sqmInput {
  sqft: number;
  auto_input_2: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Sqft_to_sqmInputSchema = z.object({
  sqft: z.number().default(100),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sqft_to_sqmInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sqft * 0.09290304; results["sqm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sqm"] = Number.NaN; }
  try { const v = input.sqft * 0.09290304; results["sqm_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sqm_aux"] = Number.NaN; }
  return results;
}


export function calculateSqft_to_sqm(input: Sqft_to_sqmInput): Sqft_to_sqmOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sqm"]);
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


export interface Sqft_to_sqmOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
