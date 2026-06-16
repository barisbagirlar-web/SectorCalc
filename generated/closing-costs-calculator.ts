// Auto-generated from closing-costs-calculator-schema.json
import * as z from 'zod';

export interface Closing_costs_calculatorInput {
  propertyPrice: number;
  downPaymentRate: number;
  originationFeeRate: number;
  appraisalFee: number;
  titleInsurance: number;
  recordingFees: number;
}

export const Closing_costs_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(300000),
  downPaymentRate: z.number().default(20),
  originationFeeRate: z.number().default(1),
  appraisalFee: z.number().default(500),
  titleInsurance: z.number().default(1000),
  recordingFees: z.number().default(200),
});

function evaluateAllFormulas(input: Closing_costs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyPrice * input.downPaymentRate / 100; results["downPayment"] = Number.isFinite(v) ? v : 0; } catch { results["downPayment"] = 0; }
  try { const v = input.propertyPrice - (results["downPayment"] ?? 0); results["loanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = (results["loanAmount"] ?? 0) * input.originationFeeRate / 100; results["originationFee"] = Number.isFinite(v) ? v : 0; } catch { results["originationFee"] = 0; }
  try { const v = (results["downPayment"] ?? 0) + (results["originationFee"] ?? 0) + input.appraisalFee + input.titleInsurance + input.recordingFees; results["totalClosingCosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalClosingCosts"] = 0; }
  return results;
}


export function calculateClosing_costs_calculator(input: Closing_costs_calculatorInput): Closing_costs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalClosingCosts"] ?? 0;
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


export interface Closing_costs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
