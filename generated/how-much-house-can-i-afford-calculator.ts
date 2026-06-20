// Auto-generated from how-much-house-can-i-afford-calculator-schema.json
import * as z from 'zod';

export interface How_much_house_can_i_afford_calculatorInput {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  insuranceRate: number;
  monthlyHOA: number;
  dataConfidence?: number;
}

export const How_much_house_can_i_afford_calculatorInputSchema = z.object({
  annualIncome: z.number().default(80000),
  monthlyDebts: z.number().default(500),
  downPayment: z.number().default(20000),
  interestRate: z.number().default(6.5),
  loanTerm: z.number().default(30),
  propertyTaxRate: z.number().default(1.2),
  insuranceRate: z.number().default(0.5),
  monthlyHOA: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: How_much_house_can_i_afford_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome / 12; results["monthlyIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyIncome"])) * 0.36; results["maxTotalMonthlyDebt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxTotalMonthlyDebt"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyIncome"])) * 0.28; results["maxHousingExpense"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxHousingExpense"] = Number.NaN; }
  try { const v = input.interestRate / 100 / 12; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r"] = Number.NaN; }
  try { const v = input.loanTerm * 12; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["r"])) * (1 + (toNumericFormulaValue(results["r"]))) ** (toNumericFormulaValue(results["n"]))) / ((1 + (toNumericFormulaValue(results["r"]))) ** (toNumericFormulaValue(results["n"])) - 1); results["monthlyPaymentFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPaymentFactor"] = Number.NaN; }
  try { const v = (input.propertyTaxRate / 100 + input.insuranceRate / 100) / 12; results["monthlyTaxInsuranceRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyTaxInsuranceRate"] = Number.NaN; }
  return results;
}


export function calculateHow_much_house_can_i_afford_calculator(input: How_much_house_can_i_afford_calculatorInput): How_much_house_can_i_afford_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyTaxInsuranceRate"]);
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


export interface How_much_house_can_i_afford_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
