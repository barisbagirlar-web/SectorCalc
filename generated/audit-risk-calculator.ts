// Auto-generated from audit-risk-calculator-schema.json
import * as z from 'zod';

export interface Audit_risk_calculatorInput {
  dogustan: number;
  kontrol: number;
  tespit: number;
  dataConfidence?: number;
}

export const Audit_risk_calculatorInputSchema = z.object({
  dogustan: z.number().min(0).max(100).default(50),
  kontrol: z.number().min(0).max(100).default(40),
  tespit: z.number().min(0).max(100).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Audit_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dogustan / 100) * (input.kontrol / 100) * (input.tespit / 100) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAudit_risk_calculator(input: Audit_risk_calculatorInput): Audit_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Audit_risk_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Audit_risk_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

