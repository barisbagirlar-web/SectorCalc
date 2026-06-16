// Auto-generated from espp-calculator-schema.json
import * as z from 'zod';

export interface Espp_calculatorInput {
  fmv: number;
  discountRate: number;
  numberOfShares: number;
  holdingPeriodMonths: number;
  ordinaryIncomeTaxRate: number;
  capitalGainsTaxRate: number;
}

export const Espp_calculatorInputSchema = z.object({
  fmv: z.number().default(100),
  discountRate: z.number().default(15),
  numberOfShares: z.number().default(100),
  holdingPeriodMonths: z.number().default(0),
  ordinaryIncomeTaxRate: z.number().default(22),
  capitalGainsTaxRate: z.number().default(15),
});

function evaluateAllFormulas(input: Espp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fmv * (1 - input.discountRate / 100); results["purchasePricePerShare"] = Number.isFinite(v) ? v : 0; } catch { results["purchasePricePerShare"] = 0; }
  try { const v = (results["purchasePricePerShare"] ?? 0) * input.numberOfShares; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.fmv * input.numberOfShares; results["immediateMarketValue"] = Number.isFinite(v) ? v : 0; } catch { results["immediateMarketValue"] = 0; }
  try { const v = (results["immediateMarketValue"] ?? 0) - (results["totalCost"] ?? 0); results["immediateGain"] = Number.isFinite(v) ? v : 0; } catch { results["immediateGain"] = 0; }
  try { const v = (results["immediateGain"] ?? 0) * (input.holdingPeriodMonths === 0 ? input.ordinaryIncomeTaxRate : input.capitalGainsTaxRate) / 100; results["taxIfSoldImmediately"] = Number.isFinite(v) ? v : 0; } catch { results["taxIfSoldImmediately"] = 0; }
  try { const v = (results["immediateGain"] ?? 0) - (results["taxIfSoldImmediately"] ?? 0); results["afterTaxGain"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxGain"] = 0; }
  try { const v = ((results["immediateGain"] ?? 0) / (results["totalCost"] ?? 0)) * 100; results["effectiveDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDiscount"] = 0; }
  return results;
}


export function calculateEspp_calculator(input: Espp_calculatorInput): Espp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["afterTaxGain"] ?? 0;
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


export interface Espp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
