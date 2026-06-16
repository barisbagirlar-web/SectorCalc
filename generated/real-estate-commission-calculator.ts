// Auto-generated from real-estate-commission-calculator-schema.json
import * as z from 'zod';

export interface Real_estate_commission_calculatorInput {
  salePrice: number;
  totalCommissionRate: number;
  buyerAgentSplit: number;
  additionalFlatFee: number;
  vatRate: number;
  isVatApplicable: number;
}

export const Real_estate_commission_calculatorInputSchema = z.object({
  salePrice: z.number().default(300000),
  totalCommissionRate: z.number().default(5),
  buyerAgentSplit: z.number().default(50),
  additionalFlatFee: z.number().default(0),
  vatRate: z.number().default(20),
  isVatApplicable: z.number().default(1),
});

function evaluateAllFormulas(input: Real_estate_commission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice * input.totalCommissionRate / 100; results["totalCommission"] = Number.isFinite(v) ? v : 0; } catch { results["totalCommission"] = 0; }
  try { const v = (results["totalCommission"] ?? 0) * input.buyerAgentSplit / 100; results["buyerCommission"] = Number.isFinite(v) ? v : 0; } catch { results["buyerCommission"] = 0; }
  try { const v = (results["totalCommission"] ?? 0) - (results["buyerCommission"] ?? 0); results["sellerCommission"] = Number.isFinite(v) ? v : 0; } catch { results["sellerCommission"] = 0; }
  try { const v = input.isVatApplicable * (results["totalCommission"] ?? 0) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["totalCommission"] ?? 0) + (results["vatAmount"] ?? 0) + input.additionalFlatFee; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.salePrice - (results["totalCost"] ?? 0); results["netProceeds"] = Number.isFinite(v) ? v : 0; } catch { results["netProceeds"] = 0; }
  return results;
}


export function calculateReal_estate_commission_calculator(input: Real_estate_commission_calculatorInput): Real_estate_commission_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProceeds"] ?? 0;
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


export interface Real_estate_commission_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
