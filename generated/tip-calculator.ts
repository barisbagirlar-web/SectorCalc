// Auto-generated from tip-calculator-schema.json
import * as z from 'zod';

export interface Tip_calculatorInput {
  bill_amount: number;
  service_quality: string;
  party_size: number;
  include_tax_in_tip: boolean;
  tax_amount: number;
  round_up: boolean;
}

export const Tip_calculatorInputSchema = z.object({
  bill_amount: z.number().min(0.01).max(100000).default(50),
  service_quality: z.enum(['poor', 'average', 'good', 'excellent']).default('average'),
  party_size: z.number().min(1).max(100).default(2),
  include_tax_in_tip: z.boolean().default(false),
  tax_amount: z.number().min(0).max(10000).default(5),
  round_up: z.boolean().default(false),
});

function evaluateAllFormulas(input: Tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["base_tip_percentage"] = 0;
  results["adjusted_tip_percentage"] = 0;
  results["effective_bill_amount"] = 0;
  try { results["raw_tip_amount"] = (results["effective_bill_amount"] ?? 0) * ((results["adjusted_tip_percentage"] ?? 0) / 100); } catch { results["raw_tip_amount"] = 0; }
  results["final_tip_amount"] = 0;
  try { results["total_paid"] = input.bill_amount + input.tax_amount + (results["final_tip_amount"] ?? 0); } catch { results["total_paid"] = 0; }
  try { results["tip_percentage"] = (Math.round((((results["final_tip_amount"] ?? 0) / input.bill_amount) * 100) * 10**(2)) / 10**(2)); } catch { results["tip_percentage"] = 0; }
  return results;
}


export function calculateTip_calculator(input: Tip_calculatorInput): Tip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["final_tip_amount"] ?? 0;
  const breakdown = {
    base_tip_percentage: values["base_tip_percentage"] ?? 0,
    adjusted_tip_percentage: values["adjusted_tip_percentage"] ?? 0,
    effective_bill_amount: values["effective_bill_amount"] ?? 0,
    raw_tip_amount: values["raw_tip_amount"] ?? 0,
    total_paid: values["total_paid"] ?? 0,
    tip_percentage: values["tip_percentage"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Rounding Loss","Tax Inclusion Effect","Party Size Premium"];
  const suggestedActions: string[] = ["Consider discussing service concerns with management to improve future experiences.","Consider splitting the tip equally among party members for convenience.","Verify if automatic gratuity has already been added to the bill before adding additional tip.","Consider rounding up the tip to the nearest dollar for simplicity."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: { base_tip_percentage: number; adjusted_tip_percentage: number; effective_bill_amount: number; raw_tip_amount: number; total_paid: number; tip_percentage: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
