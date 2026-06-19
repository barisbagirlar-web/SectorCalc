// Auto-generated from cd-calculator-schema.json
import * as z from 'zod';

export interface Cd_calculatorInput {
  initialDeposit: number;
  annualRate: number;
  termMonths: number;
  compoundingFrequency: number;
  additionalDeposit: number;
  dataConfidence?: number;
}

export const Cd_calculatorInputSchema = z.object({
  initialDeposit: z.number().default(10000),
  annualRate: z.number().default(5),
  termMonths: z.number().default(12),
  compoundingFrequency: z.number().default(12),
  additionalDeposit: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialDeposit * (input.annualRate / 100) * input.termMonths * input.compoundingFrequency; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.initialDeposit * (input.annualRate / 100) * input.termMonths * input.compoundingFrequency * (input.additionalDeposit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.additionalDeposit; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCd_calculator(input: Cd_calculatorInput): Cd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
