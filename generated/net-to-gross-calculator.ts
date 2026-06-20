// Auto-generated from net-to-gross-calculator-schema.json
import * as z from 'zod';

export interface Net_to_gross_calculatorInput {
  netAmount: number;
  taxRate: number;
  socialInsuranceRate: number;
  additionalDeductionRate: number;
  otherDeductionsFixed: number;
  dataConfidence?: number;
}

export const Net_to_gross_calculatorInputSchema = z.object({
  netAmount: z.number().default(1000),
  taxRate: z.number().default(20),
  socialInsuranceRate: z.number().default(15),
  additionalDeductionRate: z.number().default(5),
  otherDeductionsFixed: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Net_to_gross_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.taxRate + input.socialInsuranceRate + input.additionalDeductionRate) / 100; results["totalRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRate"] = Number.NaN; }
  try { const v = (input.netAmount + input.otherDeductionsFixed) / (1 - (toNumericFormulaValue(results["totalRate"]))); results["grossAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossAmount"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossAmount"])) * (input.socialInsuranceRate / 100); results["socialInsuranceAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["socialInsuranceAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossAmount"])) * (input.additionalDeductionRate / 100); results["additionalDeductionAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["additionalDeductionAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxAmount"])) + (toNumericFormulaValue(results["socialInsuranceAmount"])) + (toNumericFormulaValue(results["additionalDeductionAmount"])) + input.otherDeductionsFixed; results["totalDeductions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDeductions"] = Number.NaN; }
  return results;
}


export function calculateNet_to_gross_calculator(input: Net_to_gross_calculatorInput): Net_to_gross_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossAmount"]);
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


export interface Net_to_gross_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
