// Auto-generated from car-lease-calculator-schema.json
import * as z from 'zod';

export interface Car_lease_calculatorInput {
  carPrice: number;
  residualValue: number;
  moneyFactor: number;
  leaseTerm: number;
  downPayment: number;
  salesTaxRate: number;
  acquisitionFee: number;
}

export const Car_lease_calculatorInputSchema = z.object({
  carPrice: z.number().default(30000),
  residualValue: z.number().default(15000),
  moneyFactor: z.number().default(0.0025),
  leaseTerm: z.number().default(36),
  downPayment: z.number().default(2000),
  salesTaxRate: z.number().default(18),
  acquisitionFee: z.number().default(500),
});

function evaluateAllFormulas(input: Car_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carPrice - input.downPayment + input.acquisitionFee; results["netCapCost"] = Number.isFinite(v) ? v : 0; } catch { results["netCapCost"] = 0; }
  try { const v = ((results["netCapCost"] ?? 0) - input.residualValue) / input.leaseTerm; results["depreciationFee"] = Number.isFinite(v) ? v : 0; } catch { results["depreciationFee"] = 0; }
  try { const v = ((results["netCapCost"] ?? 0) + input.residualValue) * input.moneyFactor; results["financeFee"] = Number.isFinite(v) ? v : 0; } catch { results["financeFee"] = 0; }
  try { const v = (results["depreciationFee"] ?? 0) + (results["financeFee"] ?? 0); results["monthlyPaymentBeforeTax"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPaymentBeforeTax"] = 0; }
  try { const v = (results["monthlyPaymentBeforeTax"] ?? 0) * (1 + input.salesTaxRate / 100); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.leaseTerm + input.downPayment + input.acquisitionFee; results["totalLeaseCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLeaseCost"] = 0; }
  return results;
}


export function calculateCar_lease_calculator(input: Car_lease_calculatorInput): Car_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Car_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
