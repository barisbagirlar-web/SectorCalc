// Auto-generated from accounts-receivable-turnover-calculator-schema.json
import * as z from 'zod';

export interface Accounts_receivable_turnover_calculatorInput {
  yillikSatis: number;
  ortAlacak: number;
  dataConfidence?: number;
}

export const Accounts_receivable_turnover_calculatorInputSchema = z.object({
  yillikSatis: z.number().min(0).default(2000000),
  ortAlacak: z.number().min(0).default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Accounts_receivable_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yillikSatis / Math.max(0.0001, input.ortAlacak); results["devirHizi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["devirHizi"] = Number.NaN; }
  try { const v = 365 / Math.max(0.0001, input.yillikSatis / Math.max(0.0001, input.ortAlacak)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAccounts_receivable_turnover_calculator(input: Accounts_receivable_turnover_calculatorInput): Accounts_receivable_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "days",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Accounts_receivable_turnover_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Accounts_receivable_turnover_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "days",
  breakdownKeys: ["sonuc"],
} as const;

