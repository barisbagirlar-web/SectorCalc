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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gross_to_net_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurityAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["socialSecurityAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxAmount"])) + (asFormulaNumber(results["socialSecurityAmount"])) + input.otherDeductions; results["totalDeductions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDeductions"] = 0; }
  try { const v = input.grossSalary - (asFormulaNumber(results["totalDeductions"])); results["netSalary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netSalary"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGross_to_net_calculator(input: Gross_to_net_calculatorInput): Gross_to_net_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netSalary"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
