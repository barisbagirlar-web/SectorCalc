// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Net_to_gross_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.taxRate + input.socialInsuranceRate + input.additionalDeductionRate) / 100; results["totalRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRate"] = 0; }
  try { const v = (input.netAmount + input.otherDeductionsFixed) / (1 - (asFormulaNumber(results["totalRate"]))); results["grossAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossAmount"] = 0; }
  try { const v = (asFormulaNumber(results["grossAmount"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["grossAmount"])) * (input.socialInsuranceRate / 100); results["socialInsuranceAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["socialInsuranceAmount"] = 0; }
  try { const v = (asFormulaNumber(results["grossAmount"])) * (input.additionalDeductionRate / 100); results["additionalDeductionAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["additionalDeductionAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxAmount"])) + (asFormulaNumber(results["socialInsuranceAmount"])) + (asFormulaNumber(results["additionalDeductionAmount"])) + input.otherDeductionsFixed; results["totalDeductions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDeductions"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNet_to_gross_calculator(input: Net_to_gross_calculatorInput): Net_to_gross_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossAmount"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
