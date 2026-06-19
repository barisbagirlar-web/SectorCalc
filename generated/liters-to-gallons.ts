// Auto-generated from liters-to-gallons-schema.json
import * as z from 'zod';

export interface Liters_to_gallonsInput {
  volume_liters: number;
  conversion_type: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Liters_to_gallonsInputSchema = z.object({
  volume_liters: z.number().default(1),
  conversion_type: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Liters_to_gallonsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume_liters * 0.264172; results["gallons_us"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gallons_us"] = 0; }
  try { const v = input.volume_liters * 0.219969; results["gallons_uk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gallons_uk"] = 0; }
  try { const v = ((input.conversion_type === 1 ? (asFormulaNumber(results["gallons_us"])) : (asFormulaNumber(results["gallons_uk"]))) ? 1 : 0); results["gallons_selected"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gallons_selected"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLiters_to_gallons(input: Liters_to_gallonsInput): Liters_to_gallonsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gallons_selected"]);
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


export interface Liters_to_gallonsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
