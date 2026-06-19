// Auto-generated from tons-of-refrigeration-to-kw-schema.json
import * as z from 'zod';

export interface Tons_of_refrigeration_to_kwInput {
  tons: number;
  auto_input_2: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Tons_of_refrigeration_to_kwInputSchema = z.object({
  tons: z.number().default(1),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tons_of_refrigeration_to_kwInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tons * 3.5168525; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.tons; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTons_of_refrigeration_to_kw(input: Tons_of_refrigeration_to_kwInput): Tons_of_refrigeration_to_kwOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Tons_of_refrigeration_to_kwOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
