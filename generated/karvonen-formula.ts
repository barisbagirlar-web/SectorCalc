// @ts-nocheck
// Auto-generated from karvonen-formula-schema.json
import * as z from 'zod';

export interface Karvonen_formulaInput {
  age: number;
  resting_hr: number;
  max_hr: number;
  intensity_min: number;
  intensity_max: number;
}

export const Karvonen_formulaInputSchema = z.object({
  age: z.number().default(30),
  resting_hr: z.number().default(70),
  max_hr: z.number().default(190),
  intensity_min: z.number().default(60),
  intensity_max: z.number().default(80),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Karvonen_formulaInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.max_hr - input.resting_hr; results["heartRateReserve"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = (((asFormulaNumber(results["heartRateReserve"])) * input.intensity_min) / 100) + input.resting_hr; results["targetHRMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetHRMin"] = 0; }
  try { const v = (((asFormulaNumber(results["heartRateReserve"])) * input.intensity_max) / 100) + input.resting_hr; results["targetHRMax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetHRMax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKarvonen_formula(input: Karvonen_formulaInput): Karvonen_formulaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["targetHRMax"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Karvonen_formulaOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
