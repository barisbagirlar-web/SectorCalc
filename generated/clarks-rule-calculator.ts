// Auto-generated from clarks-rule-calculator-schema.json
import * as z from 'zod';

export interface Clarks_rule_calculatorInput {
  adultDose: number;
  patientWeight: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Clarks_rule_calculatorInputSchema = z.object({
  adultDose: z.number().default(500),
  patientWeight: z.number().default(70),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Clarks_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adultDose * (input.patientWeight / 150); results["childDose"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["childDose"] = 0; }
  try { const v = input.adultDose * (input.patientWeight / 150); results["childDose___adultDose____patientWeight__"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["childDose___adultDose____patientWeight__"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateClarks_rule_calculator(input: Clarks_rule_calculatorInput): Clarks_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["childDose___adultDose____patientWeight__"]);
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


export interface Clarks_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
