// Auto-generated from visa-funds-calculator-schema.json
import * as z from 'zod';

export interface Visa_funds_calculatorInput {
  dailyExpenseEUR: number;
  numberOfDays: number;
  exchangeRate: number;
  bufferPercent: number;
  applicationFee: number;
  dataConfidence?: number;
}

export const Visa_funds_calculatorInputSchema = z.object({
  dailyExpenseEUR: z.number().default(100),
  numberOfDays: z.number().default(7),
  exchangeRate: z.number().default(1.1),
  bufferPercent: z.number().default(20),
  applicationFee: z.number().default(800),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Visa_funds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyExpenseEUR * input.numberOfDays; results["baseRequiredEUR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseRequiredEUR"] = 0; }
  try { const v = (asFormulaNumber(results["baseRequiredEUR"])) * (input.bufferPercent / 100); results["bufferEUR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bufferEUR"] = 0; }
  try { const v = (asFormulaNumber(results["baseRequiredEUR"])) + (asFormulaNumber(results["bufferEUR"])); results["totalRequiredEUR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRequiredEUR"] = 0; }
  try { const v = (asFormulaNumber(results["totalRequiredEUR"])) * input.exchangeRate; results["totalRequiredLocal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRequiredLocal"] = 0; }
  try { const v = (asFormulaNumber(results["totalRequiredLocal"])) + input.applicationFee; results["totalCostLocal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCostLocal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVisa_funds_calculator(input: Visa_funds_calculatorInput): Visa_funds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostLocal"]);
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


export interface Visa_funds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
