// Auto-generated from expected-family-contribution-calculator-schema.json
import * as z from 'zod';

export interface Expected_family_contribution_calculatorInput {
  parent_agi: number;
  parent_assets: number;
  student_income: number;
  student_assets: number;
  household_size: number;
  number_in_college: number;
  state_tax_rate: number;
  age_older_parent: number;
}

export const Expected_family_contribution_calculatorInputSchema = z.object({
  parent_agi: z.number().default(0),
  parent_assets: z.number().default(0),
  student_income: z.number().default(0),
  student_assets: z.number().default(0),
  household_size: z.number().default(4),
  number_in_college: z.number().default(1),
  state_tax_rate: z.number().default(5),
  age_older_parent: z.number().default(45),
});

function evaluateAllFormulas(input: Expected_family_contribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 15000 + 5000 * (Math.max(0, input.household_size - 1)) + 3000 * (Math.max(0, input.number_in_college - 1)); results["ipa"] = Number.isFinite(v) ? v : 0; } catch { results["ipa"] = 0; }
  try { const v = input.age_older_parent < 26 ? 0 : (input.age_older_parent >= 65 ? 100000 : (input.age_older_parent - 25) * 2500); results["apa"] = Number.isFinite(v) ? v : 0; } catch { results["apa"] = 0; }
  try { const v = input.parent_agi * 0.15; results["federal_tax"] = Number.isFinite(v) ? v : 0; } catch { results["federal_tax"] = 0; }
  try { const v = input.parent_agi * (input.state_tax_rate / 100); results["state_tax"] = Number.isFinite(v) ? v : 0; } catch { results["state_tax"] = 0; }
  try { const v = input.parent_agi * 0.0765; results["fica"] = Number.isFinite(v) ? v : 0; } catch { results["fica"] = 0; }
  try { const v = input.parent_agi - (results["federal_tax"] ?? 0) - (results["state_tax"] ?? 0) - (results["fica"] ?? 0) - (results["ipa"] ?? 0); results["available_income"] = Number.isFinite(v) ? v : 0; } catch { results["available_income"] = 0; }
  try { const v = Math.max(0, (results["available_income"] ?? 0) * 0.25); results["parent_income_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["parent_income_contribution"] = 0; }
  try { const v = Math.max(0, (input.parent_assets - (results["apa"] ?? 0)) * 0.12); results["parent_asset_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["parent_asset_contribution"] = 0; }
  try { const v = ((results["parent_income_contribution"] ?? 0) + (results["parent_asset_contribution"] ?? 0)) / input.number_in_college; results["total_parent_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["total_parent_contribution"] = 0; }
  try { const v = 6000; results["student_income_allowance"] = Number.isFinite(v) ? v : 0; } catch { results["student_income_allowance"] = 0; }
  try { const v = Math.max(0, (input.student_income - (results["student_income_allowance"] ?? 0)) * 0.5); results["student_income_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["student_income_contribution"] = 0; }
  try { const v = input.student_assets * 0.2; results["student_asset_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["student_asset_contribution"] = 0; }
  try { const v = (results["student_income_contribution"] ?? 0) + (results["student_asset_contribution"] ?? 0); results["total_student_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["total_student_contribution"] = 0; }
  try { const v = Math.ceil((results["total_parent_contribution"] ?? 0) + (results["total_student_contribution"] ?? 0)); results["efc"] = Number.isFinite(v) ? v : 0; } catch { results["efc"] = 0; }
  return results;
}


export function calculateExpected_family_contribution_calculator(input: Expected_family_contribution_calculatorInput): Expected_family_contribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["efc"] ?? 0;
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


export interface Expected_family_contribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
