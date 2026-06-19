// Auto-generated from boat-loan-calculator-schema.json
import * as z from 'zod';

export interface Boat_loan_calculatorInput {
  boatPrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRate: number;
  loanTerm: number;
  annualInterestRate: number;
  dataConfidence?: number;
}

export const Boat_loan_calculatorInputSchema = z.object({
  boatPrice: z.number().default(50000),
  downPayment: z.number().default(10000),
  tradeInValue: z.number().default(0),
  salesTaxRate: z.number().default(6),
  loanTerm: z.number().default(5),
  annualInterestRate: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Boat_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.downPayment * input.boatPrice; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.downPayment * input.boatPrice * (1 + (input.salesTaxRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.downPayment * input.boatPrice * (1 + (input.salesTaxRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBoat_loan_calculator(input: Boat_loan_calculatorInput): Boat_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Boat_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
