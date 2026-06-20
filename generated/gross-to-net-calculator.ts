// Auto-generated from gross-to-net-calculator-schema.json
import * as z from 'zod';

export interface Gross_to_net_calculatorInput {
  grossSalary: number;
  taxRate: number;
  socialSecurityRate: number;
  otherDeductions: number;
  dataConfidence?: number;
}

export const Gross_to_net_calculatorInputSchema = z.object({
  grossSalary: z.number().default(5000),
  taxRate: z.number().default(20),
  socialSecurityRate: z.number().default(15),
  otherDeductions: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gross_to_net_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurityAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["socialSecurityAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxAmount"])) + (toNumericFormulaValue(results["socialSecurityAmount"])) + input.otherDeductions; results["totalDeductions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDeductions"] = Number.NaN; }
  try { const v = input.grossSalary - (toNumericFormulaValue(results["totalDeductions"])); results["netSalary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netSalary"] = Number.NaN; }
  return results;
}


export function calculateGross_to_net_calculator(input: Gross_to_net_calculatorInput): Gross_to_net_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netSalary"]);
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


export interface Gross_to_net_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
