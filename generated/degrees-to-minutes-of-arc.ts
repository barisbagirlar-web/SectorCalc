// Auto-generated from degrees-to-minutes-of-arc-schema.json
import * as z from 'zod';

export interface Degrees_to_minutes_of_arcInput {
  degrees: number;
  minutes: number;
  seconds: number;
  decimalDegrees: number;
  dataConfidence?: number;
}

export const Degrees_to_minutes_of_arcInputSchema = z.object({
  degrees: z.number().default(0),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
  decimalDegrees: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Degrees_to_minutes_of_arcInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.degrees * 60) + input.minutes + (input.seconds / 60); results["totalMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  try { const v = input.decimalDegrees; results["totalDecimalDegrees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDecimalDegrees"] = 0; }
  try { const v = input.decimalDegrees * 60; results["minutesFromDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minutesFromDecimal"] = 0; }
  try { const v = input.degrees * 60; results["degrees___60"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degrees___60"] = 0; }
  try { const v = input.seconds / 60; results["seconds___60"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["seconds___60"] = 0; }
  try { const v = (input.degrees * 60) + input.minutes + (input.seconds / 60); results["_degrees___60____minutes____seconds___60"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["_degrees___60____minutes____seconds___60"] = 0; }
  try { const v = input.decimalDegrees * 60; results["decimalDegrees___60"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["decimalDegrees___60"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDegrees_to_minutes_of_arc(input: Degrees_to_minutes_of_arcInput): Degrees_to_minutes_of_arcOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMinutes"]);
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


export interface Degrees_to_minutes_of_arcOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
