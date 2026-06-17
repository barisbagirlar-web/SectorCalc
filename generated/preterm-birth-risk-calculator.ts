// @ts-nocheck
// Auto-generated from preterm-birth-risk-calculator-schema.json
import * as z from 'zod';

export interface Preterm_birth_risk_calculatorInput {
  age: number;
  cervicalLength: number;
  fetalFibronectin: number;
  previousPreterm: number;
}

export const Preterm_birth_risk_calculatorInputSchema = z.object({
  age: z.number().default(30),
  cervicalLength: z.number().default(35),
  fetalFibronectin: z.number().default(20),
  previousPreterm: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Preterm_birth_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = -3 + 0.1*input.age - 0.1*input.cervicalLength + 0.01*input.fetalFibronectin + 1.5*input.previousPreterm; results["linearCombo"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["linearCombo"] = 0; }
  try { const v = -3 + 0.1*input.age - 0.1*input.cervicalLength + 0.01*input.fetalFibronectin + 1.5*input.previousPreterm; results["linearCombo_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["linearCombo_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePreterm_birth_risk_calculator(input: Preterm_birth_risk_calculatorInput): Preterm_birth_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["linearCombo_aux"]);
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


export interface Preterm_birth_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
