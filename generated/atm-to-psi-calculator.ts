// @ts-nocheck
// Auto-generated from atm-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Atm_to_psi_calculatorInput {
  atm: number;
  conversionFactor: number;
  precision: number;
  offset: number;
}

export const Atm_to_psi_calculatorInputSchema = z.object({
  atm: z.number().default(1),
  conversionFactor: z.number().default(14.6959),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atm_to_psi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.atm * input.conversionFactor; results["rawPsi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawPsi"] = 0; }
  try { const v = (asFormulaNumber(results["rawPsi"])) + input.offset; results["psiWithOffset"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["psiWithOffset"] = 0; }
  try { const v = input.atm; results["atm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atm"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.offset; results["offset"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["offset"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAtm_to_psi_calculator(input: Atm_to_psi_calculatorInput): Atm_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["offset"]);
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


export interface Atm_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
