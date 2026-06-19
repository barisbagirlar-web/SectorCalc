// Auto-generated from barista-fire-calculator-schema.json
import * as z from 'zod';

export interface Barista_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  annualReturn: number;
  withdrawalRate: number;
  annualExpenses: number;
  partTimeIncome: number;
  dataConfidence?: number;
}

export const Barista_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentSavings: z.number().default(50000),
  monthlySavings: z.number().default(1000),
  annualReturn: z.number().default(7),
  withdrawalRate: z.number().default(4),
  annualExpenses: z.number().default(40000),
  partTimeIncome: z.number().default(12000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Barista_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentAge * input.currentSavings; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.currentAge * input.currentSavings * (1 + (input.annualReturn / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.currentAge * input.currentSavings * (1 + (input.annualReturn / 100)) * (input.retirementAge); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.retirementAge; results["factor_retirementAge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_retirementAge"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBarista_fire_calculator(input: Barista_fire_calculatorInput): Barista_fire_calculatorOutput {
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


export interface Barista_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
