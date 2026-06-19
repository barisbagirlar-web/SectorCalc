// Auto-generated from mph-to-kmh-schema.json
import * as z from 'zod';

export interface Mph_to_kmhInput {
  speed_mph: number;
  auto_input_2: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Mph_to_kmhInputSchema = z.object({
  speed_mph: z.number().default(60),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mph_to_kmhInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_mph * 1.609344; results["speed_kmh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_kmh"] = 0; }
  try { const v = input.speed_mph * 1.609344; results["speed_kmh_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_kmh_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMph_to_kmh(input: Mph_to_kmhInput): Mph_to_kmhOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed_kmh"]);
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


export interface Mph_to_kmhOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
