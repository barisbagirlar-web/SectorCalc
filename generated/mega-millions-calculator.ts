// Auto-generated from mega-millions-calculator-schema.json
import * as z from 'zod';

export interface Mega_millions_calculatorInput {
  jackpot: number;
  cashOption: number;
  federalTax: number;
  stateTax: number;
  annuityYears: number;
  growthRate: number;
}

export const Mega_millions_calculatorInputSchema = z.object({
  jackpot: z.number().default(50000000),
  cashOption: z.number().default(60),
  federalTax: z.number().default(24),
  stateTax: z.number().default(5),
  annuityYears: z.number().default(30),
  growthRate: z.number().default(5),
});

function evaluateAllFormulas(input: Mega_millions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jackpot * (input.cashOption / 100); results["lumpSumAmount"] = Number.isFinite(v) ? v : 0; } catch { results["lumpSumAmount"] = 0; }
  try { const v = (input.federalTax + input.stateTax) / 100; results["totalTaxRate"] = Number.isFinite(v) ? v : 0; } catch { results["totalTaxRate"] = 0; }
  try { const v = (results["lumpSumAmount"] ?? 0) * (1 - (results["totalTaxRate"] ?? 0)); results["lumpSumAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["lumpSumAfterTax"] = 0; }
  try { const v = input.jackpot * (input.growthRate / 100) / (Math.pow(1 + input.growthRate / 100, input.annuityYears) - 1); results["annuityFirstPayment"] = Number.isFinite(v) ? v : 0; } catch { results["annuityFirstPayment"] = 0; }
  try { const v = (results["annuityFirstPayment"] ?? 0) * Math.pow(1 + input.growthRate / 100, input.annuityYears - 1); results["annuityLastPayment"] = Number.isFinite(v) ? v : 0; } catch { results["annuityLastPayment"] = 0; }
  try { const v = input.jackpot * (1 - (results["totalTaxRate"] ?? 0)); results["totalAnnuityAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnuityAfterTax"] = 0; }
  return results;
}


export function calculateMega_millions_calculator(input: Mega_millions_calculatorInput): Mega_millions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lumpSumAfterTax"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
