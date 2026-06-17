// Auto-generated from clarks-rule-calculator-schema.json
import * as z from 'zod';

export interface Clarks_rule_calculatorInput {
  adultDose: number;
  patientWeight: number;
  auto_input_3: number;
}

export const Clarks_rule_calculatorInputSchema = z.object({
  adultDose: z.number().default(500),
  patientWeight: z.number().default(70),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Clarks_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adultDose * (input.patientWeight / 150); results["childDose"] = Number.isFinite(v) ? v : 0; } catch { results["childDose"] = 0; }
  try { const v = Math.round((results["childDose"] ?? 0) * 100) / 100; results["childDoseRounded"] = Number.isFinite(v) ? v : 0; } catch { results["childDoseRounded"] = 0; }
  try { const v = input.adultDose * (input.patientWeight / 150); results["childDose___adultDose____patientWeight__"] = Number.isFinite(v) ? v : 0; } catch { results["childDose___adultDose____patientWeight__"] = 0; }
  try { const v = Math.round((results["childDose"] ?? 0) * 100) / 100; results["childDoseRounded___Math_round_childDose_"] = Number.isFinite(v) ? v : 0; } catch { results["childDoseRounded___Math_round_childDose_"] = 0; }
  return results;
}


export function calculateClarks_rule_calculator(input: Clarks_rule_calculatorInput): Clarks_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["childDoseRounded"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
