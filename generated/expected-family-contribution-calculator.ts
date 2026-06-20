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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Expected_family_contribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age_older_parent < 26 ? 0 : (input.age_older_parent >= 65 ? 100000 : (input.age_older_parent - 25) * 2500); results["apa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["apa"] = Number.NaN; }
  try { const v = input.parent_agi * 0.15; results["federal_tax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["federal_tax"] = Number.NaN; }
  try { const v = input.parent_agi * (input.state_tax_rate / 100); results["state_tax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["state_tax"] = Number.NaN; }
  try { const v = input.parent_agi * 0.0765; results["fica"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fica"] = Number.NaN; }
  try { const v = input.student_assets * 0.2; results["student_asset_contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["student_asset_contribution"] = Number.NaN; }
  return results;
}


export function calculateExpected_family_contribution_calculator(input: Expected_family_contribution_calculatorInput): Expected_family_contribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["student_asset_contribution"]);
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


export interface Expected_family_contribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
