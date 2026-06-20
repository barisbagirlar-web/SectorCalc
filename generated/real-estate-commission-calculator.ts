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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Real_estate_commission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice * input.totalCommissionRate / 100; results["totalCommission"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCommission"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCommission"])) * input.buyerAgentSplit / 100; results["buyerCommission"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["buyerCommission"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCommission"])) - (toNumericFormulaValue(results["buyerCommission"])); results["sellerCommission"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellerCommission"] = Number.NaN; }
  try { const v = input.isVatApplicable * (toNumericFormulaValue(results["totalCommission"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCommission"])) + (toNumericFormulaValue(results["vatAmount"])) + input.additionalFlatFee; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.salePrice - (toNumericFormulaValue(results["totalCost"])); results["netProceeds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProceeds"] = Number.NaN; }
  return results;
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
