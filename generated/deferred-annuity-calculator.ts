// Auto-generated from deferred-annuity-calculator-schema.json
import * as z from 'zod';

export interface Deferred_annuity_calculatorInput {
  presentValue: number;
  annualInterestRate: number;
  deferralYears: number;
  payoutYears: number;
  dataConfidence?: number;
}

export const Deferred_annuity_calculatorInputSchema = z.object({
  presentValue: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  deferralYears: z.number().default(10),
  payoutYears: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deferred_annuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deferralYears * input.presentValue; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.deferralYears * input.presentValue * (1 + (input.annualInterestRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.deferralYears * input.presentValue * (1 + (input.annualInterestRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDeferred_annuity_calculator(input: Deferred_annuity_calculatorInput): Deferred_annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Deferred_annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
