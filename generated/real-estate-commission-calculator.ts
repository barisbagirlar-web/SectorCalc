// Auto-generated from real-estate-commission-calculator-schema.json
import * as z from 'zod';

export interface Real_estate_commission_calculatorInput {
  salePrice: number;
  totalCommissionRate: number;
  buyerAgentSplit: number;
  additionalFlatFee: number;
  vatRate: number;
  isVatApplicable: number;
  dataConfidence?: number;
}

export const Real_estate_commission_calculatorInputSchema = z.object({
  salePrice: z.number().default(300000),
  totalCommissionRate: z.number().default(5),
  buyerAgentSplit: z.number().default(50),
  additionalFlatFee: z.number().default(0),
  vatRate: z.number().default(20),
  isVatApplicable: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Real_estate_commission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice * input.totalCommissionRate / 100; results["totalCommission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCommission"] = 0; }
  try { const v = (asFormulaNumber(results["totalCommission"])) * input.buyerAgentSplit / 100; results["buyerCommission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["buyerCommission"] = 0; }
  try { const v = (asFormulaNumber(results["totalCommission"])) - (asFormulaNumber(results["buyerCommission"])); results["sellerCommission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sellerCommission"] = 0; }
  try { const v = input.isVatApplicable * (asFormulaNumber(results["totalCommission"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalCommission"])) + (asFormulaNumber(results["vatAmount"])) + input.additionalFlatFee; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.salePrice - (asFormulaNumber(results["totalCost"])); results["netProceeds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProceeds"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReal_estate_commission_calculator(input: Real_estate_commission_calculatorInput): Real_estate_commission_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProceeds"]);
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


export interface Real_estate_commission_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
