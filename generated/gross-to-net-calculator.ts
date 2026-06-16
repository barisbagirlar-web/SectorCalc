// Auto-generated from gross-to-net-calculator-schema.json
import * as z from 'zod';

export interface Gross_to_net_calculatorInput {
  grossSalary: number;
  taxRate: number;
  socialSecurityRate: number;
  otherDeductions: number;
}

export const Gross_to_net_calculatorInputSchema = z.object({
  grossSalary: z.number().default(5000),
  taxRate: z.number().default(20),
  socialSecurityRate: z.number().default(15),
  otherDeductions: z.number().default(0),
});

function evaluateAllFormulas(input: Gross_to_net_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurityAmount"] = Number.isFinite(v) ? v : 0; } catch { results["socialSecurityAmount"] = 0; }
  try { const v = (results["taxAmount"] ?? 0) + (results["socialSecurityAmount"] ?? 0) + input.otherDeductions; results["totalDeductions"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeductions"] = 0; }
  try { const v = input.grossSalary - (results["totalDeductions"] ?? 0); results["netSalary"] = Number.isFinite(v) ? v : 0; } catch { results["netSalary"] = 0; }
  return results;
}


export function calculateGross_to_net_calculator(input: Gross_to_net_calculatorInput): Gross_to_net_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netSalary"] ?? 0;
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


export interface Gross_to_net_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
