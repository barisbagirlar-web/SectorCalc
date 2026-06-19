// Auto-generated from espp-calculator-schema.json
import * as z from 'zod';

export interface Espp_calculatorInput {
  fmv: number;
  discountRate: number;
  numberOfShares: number;
  holdingPeriodMonths: number;
  ordinaryIncomeTaxRate: number;
  capitalGainsTaxRate: number;
  dataConfidence?: number;
}

export const Espp_calculatorInputSchema = z.object({
  fmv: z.number().default(100),
  discountRate: z.number().default(15),
  numberOfShares: z.number().default(100),
  holdingPeriodMonths: z.number().default(0),
  ordinaryIncomeTaxRate: z.number().default(22),
  capitalGainsTaxRate: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Espp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fmv * (1 - input.discountRate / 100); results["purchasePricePerShare"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["purchasePricePerShare"] = 0; }
  try { const v = (asFormulaNumber(results["purchasePricePerShare"])) * input.numberOfShares; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.fmv * input.numberOfShares; results["immediateMarketValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["immediateMarketValue"] = 0; }
  try { const v = (asFormulaNumber(results["immediateMarketValue"])) - (asFormulaNumber(results["totalCost"])); results["immediateGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["immediateGain"] = 0; }
  try { const v = (((asFormulaNumber(results["immediateGain"])) * (input.holdingPeriodMonths === 0 ? input.ordinaryIncomeTaxRate : input.capitalGainsTaxRate) / 100) ? 1 : 0); results["taxIfSoldImmediately"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxIfSoldImmediately"] = 0; }
  try { const v = (asFormulaNumber(results["immediateGain"])) - (asFormulaNumber(results["taxIfSoldImmediately"])); results["afterTaxGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["afterTaxGain"] = 0; }
  try { const v = ((asFormulaNumber(results["immediateGain"])) / (asFormulaNumber(results["totalCost"]))) * 100; results["effectiveDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveDiscount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEspp_calculator(input: Espp_calculatorInput): Espp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["afterTaxGain"]);
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


export interface Espp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
