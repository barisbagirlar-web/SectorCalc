// Auto-generated from meters-per-second-to-mph-schema.json
import * as z from 'zod';

export interface Meters_per_second_to_mphInput {
  speed_mps: number;
  auto_input_2: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Meters_per_second_to_mphInputSchema = z.object({
  speed_mps: z.number().default(10),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meters_per_second_to_mphInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_mps * 2.23694; results["speed_mph"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_mph"] = 0; }
  try { const v = input.speed_mps * 2.23694; results["speed_mph_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_mph_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMeters_per_second_to_mph(input: Meters_per_second_to_mphInput): Meters_per_second_to_mphOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed_mph"]);
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


export interface Meters_per_second_to_mphOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
