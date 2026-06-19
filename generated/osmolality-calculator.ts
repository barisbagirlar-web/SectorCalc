// Auto-generated from osmolality-calculator-schema.json
import * as z from 'zod';

export interface Osmolality_calculatorInput {
  sodium: number;
  glucose: number;
  bun: number;
  measuredOsm: number;
  dataConfidence?: number;
}

export const Osmolality_calculatorInputSchema = z.object({
  sodium: z.number().default(140),
  glucose: z.number().default(90),
  bun: z.number().default(14),
  measuredOsm: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Osmolality_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.sodium + input.glucose / 18 + input.bun / 2.8; results["calculatedOsmolality"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calculatedOsmolality"] = 0; }
  try { const v = 2 * input.sodium; results["sodiumContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sodiumContribution"] = 0; }
  try { const v = input.glucose / 18; results["glucoseContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["glucoseContribution"] = 0; }
  try { const v = input.bun / 2.8; results["bunContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bunContribution"] = 0; }
  try { const v = input.measuredOsm > 0 ? input.measuredOsm - (2 * input.sodium + input.glucose / 18 + input.bun / 2.8) : null; results["osmolarGap"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["osmolarGap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOsmolality_calculator(input: Osmolality_calculatorInput): Osmolality_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calculatedOsmolality"]);
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


export interface Osmolality_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
