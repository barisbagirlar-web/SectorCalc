// Auto-generated from mega-millions-calculator-schema.json
import * as z from 'zod';

export interface Mega_millions_calculatorInput {
  jackpot: number;
  cashOption: number;
  federalTax: number;
  stateTax: number;
  annuityYears: number;
  growthRate: number;
  dataConfidence?: number;
}

export const Mega_millions_calculatorInputSchema = z.object({
  jackpot: z.number().default(50000000),
  cashOption: z.number().default(60),
  federalTax: z.number().default(24),
  stateTax: z.number().default(5),
  annuityYears: z.number().default(30),
  growthRate: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mega_millions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jackpot * (input.cashOption / 100); results["lumpSumAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lumpSumAmount"] = 0; }
  try { const v = (input.federalTax + input.stateTax) / 100; results["totalTaxRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTaxRate"] = 0; }
  try { const v = (asFormulaNumber(results["lumpSumAmount"])) * (1 - (asFormulaNumber(results["totalTaxRate"]))); results["lumpSumAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lumpSumAfterTax"] = 0; }
  try { const v = input.jackpot * (1 - (asFormulaNumber(results["totalTaxRate"]))); results["totalAnnuityAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAnnuityAfterTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMega_millions_calculator(input: Mega_millions_calculatorInput): Mega_millions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lumpSumAfterTax"]);
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


export interface Mega_millions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
