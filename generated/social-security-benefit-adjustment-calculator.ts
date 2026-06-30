// Auto-generated from social-security-benefit-adjustment-calculator-schema.json
import * as z from 'zod';

export interface Social_security_benefit_adjustment_calculatorInput {
  dataConfidence?: number;
  ortIndeksliKazanc: number;
  emeklilikYasi: number;
}

export const Social_security_benefit_adjustment_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  ortIndeksliKazanc: z.number().min(0).default(8000),
  emeklilikYasi: z.number().min(62).max(70).default(65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Social_security_benefit_adjustment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["ortIndeksliKazanc"] * 0.9; results["temelBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["temelBenefit"] = Number.NaN; }
  try { const v = input["emeklilikYasi"] >= 67 ? 1 + (input["emeklilikYasi"] - 67) * 0.08 : 1 - (67 - input["emeklilikYasi"]) * 0.067; results["yasCarpani"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yasCarpani"] = Number.NaN; }
  try { const v = (input["ortIndeksliKazanc"] * 0.9) * (input["emeklilikYasi"] >= 67 ? 1 + (input["emeklilikYasi"] - 67) * 0.08 : 1 - (67 - input["emeklilikYasi"]) * 0.067); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSocial_security_benefit_adjustment_calculator(input: Social_security_benefit_adjustment_calculatorInput): Social_security_benefit_adjustment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Social_security_benefit_adjustment_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Social_security_benefit_adjustment_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["temelBenefit","yasCarpani"],
} as const;
