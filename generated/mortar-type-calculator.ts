// @ts-nocheck
// Auto-generated from mortar-type-calculator-schema.json
import * as z from 'zod';

export interface Mortar_type_calculatorInput {
  design_strength: number;
  exposure_factor: number;
  reinforced: number;
  safety_factor: number;
}

export const Mortar_type_calculatorInputSchema = z.object({
  design_strength: z.number().default(5),
  exposure_factor: z.number().default(1.3),
  reinforced: z.number().default(0),
  safety_factor: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mortar_type_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.design_strength * input.exposure_factor * (input.reinforced ? 1.2 : 1) * input.safety_factor; results["required_strength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["required_strength"] = 0; }
  results["mortarType"] = 0;
  try { const v = ((asFormulaNumber(results["mortarType"])) == 'M') ? 17.2 : ((asFormulaNumber(results["mortarType"])) == 'S') ? 12.4 : ((asFormulaNumber(results["mortarType"])) == 'N') ? 5.2 : ((asFormulaNumber(results["mortarType"])) == 'O') ? 2.4 : 0.5; results["min_strength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["min_strength"] = 0; }
  try { const v = (asFormulaNumber(results["required_strength"])) - (asFormulaNumber(results["min_strength"])); results["safety_margin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safety_margin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMortar_type_calculator(input: Mortar_type_calculatorInput): Mortar_type_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mortarType"]);
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


export interface Mortar_type_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
