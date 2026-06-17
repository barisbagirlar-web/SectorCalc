// @ts-nocheck
// Auto-generated from merit-aid-calculator-schema.json
import * as z from 'zod';

export interface Merit_aid_calculatorInput {
  coa: number;
  meritCapPercent: number;
  otherAid: number;
  efc: number;
}

export const Merit_aid_calculatorInputSchema = z.object({
  coa: z.number().default(50000),
  meritCapPercent: z.number().default(50),
  otherAid: z.number().default(0),
  efc: z.number().default(20000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Merit_aid_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.coa * (input.meritCapPercent / 100); results["maxMerit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxMerit"] = 0; }
  try { const v = input.coa * (input.meritCapPercent / 100); results["maxMerit_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxMerit_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMerit_aid_calculator(input: Merit_aid_calculatorInput): Merit_aid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxMerit_aux"]);
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


export interface Merit_aid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
