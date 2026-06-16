// Auto-generated from net-to-gross-calculator-schema.json
import * as z from 'zod';

export interface Net_to_gross_calculatorInput {
  netAmount: number;
  taxRate: number;
  socialInsuranceRate: number;
  additionalDeductionRate: number;
  otherDeductionsFixed: number;
}

export const Net_to_gross_calculatorInputSchema = z.object({
  netAmount: z.number().default(1000),
  taxRate: z.number().default(20),
  socialInsuranceRate: z.number().default(15),
  additionalDeductionRate: z.number().default(5),
  otherDeductionsFixed: z.number().default(0),
});

function evaluateAllFormulas(input: Net_to_gross_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.taxRate + input.socialInsuranceRate + input.additionalDeductionRate) / 100; results["totalRate"] = Number.isFinite(v) ? v : 0; } catch { results["totalRate"] = 0; }
  try { const v = (input.netAmount + input.otherDeductionsFixed) / (1 - (results["totalRate"] ?? 0)); results["grossAmount"] = Number.isFinite(v) ? v : 0; } catch { results["grossAmount"] = 0; }
  try { const v = (results["grossAmount"] ?? 0) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["grossAmount"] ?? 0) * (input.socialInsuranceRate / 100); results["socialInsuranceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["socialInsuranceAmount"] = 0; }
  try { const v = (results["grossAmount"] ?? 0) * (input.additionalDeductionRate / 100); results["additionalDeductionAmount"] = Number.isFinite(v) ? v : 0; } catch { results["additionalDeductionAmount"] = 0; }
  try { const v = (results["taxAmount"] ?? 0) + (results["socialInsuranceAmount"] ?? 0) + (results["additionalDeductionAmount"] ?? 0) + input.otherDeductionsFixed; results["totalDeductions"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeductions"] = 0; }
  return results;
}


export function calculateNet_to_gross_calculator(input: Net_to_gross_calculatorInput): Net_to_gross_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossAmount"] ?? 0;
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


export interface Net_to_gross_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
