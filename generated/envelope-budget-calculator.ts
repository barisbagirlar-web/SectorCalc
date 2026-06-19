// Auto-generated from envelope-budget-calculator-schema.json
import * as z from 'zod';

export interface Envelope_budget_calculatorInput {
  totalIncome: number;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  dataConfidence?: number;
}

export const Envelope_budget_calculatorInputSchema = z.object({
  totalIncome: z.number().default(0),
  needsPct: z.number().default(50),
  wantsPct: z.number().default(30),
  savingsPct: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Envelope_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalIncome * input.needsPct / 100; results["needsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["needsAmount"] = 0; }
  try { const v = input.totalIncome * input.wantsPct / 100; results["wantsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wantsAmount"] = 0; }
  try { const v = input.totalIncome * input.savingsPct / 100; results["savingsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["savingsAmount"] = 0; }
  try { const v = (asFormulaNumber(results["needsAmount"])) + (asFormulaNumber(results["wantsAmount"])) + (asFormulaNumber(results["savingsAmount"])); results["totalAllocated"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAllocated"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEnvelope_budget_calculator(input: Envelope_budget_calculatorInput): Envelope_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalAllocated"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Envelope_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
