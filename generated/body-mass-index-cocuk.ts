// Auto-generated from body-mass-index-cocuk-schema.json
import * as z from 'zod';

export interface Body_mass_index_cocukInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  dataConfidence?: number;
}

export const Body_mass_index_cocukInputSchema = z.object({
  weight: z.number().default(30),
  height: z.number().default(130),
  age: z.number().default(8),
  gender: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Body_mass_index_cocukInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmi_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBody_mass_index_cocuk(input: Body_mass_index_cocukInput): Body_mass_index_cocukOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bmi"]);
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


export interface Body_mass_index_cocukOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
