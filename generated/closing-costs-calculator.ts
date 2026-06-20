// Auto-generated from closing-costs-calculator-schema.json
import * as z from 'zod';

export interface Closing_costs_calculatorInput {
  propertyPrice: number;
  downPaymentRate: number;
  originationFeeRate: number;
  appraisalFee: number;
  titleInsurance: number;
  recordingFees: number;
  dataConfidence?: number;
}

export const Closing_costs_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(300000),
  downPaymentRate: z.number().default(20),
  originationFeeRate: z.number().default(1),
  appraisalFee: z.number().default(500),
  titleInsurance: z.number().default(1000),
  recordingFees: z.number().default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Closing_costs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyPrice * input.downPaymentRate / 100; results["downPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downPayment"] = Number.NaN; }
  try { const v = input.propertyPrice - (toNumericFormulaValue(results["downPayment"])); results["loanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["loanAmount"])) * input.originationFeeRate / 100; results["originationFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["originationFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["downPayment"])) + (toNumericFormulaValue(results["originationFee"])) + input.appraisalFee + input.titleInsurance + input.recordingFees; results["totalClosingCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalClosingCosts"] = Number.NaN; }
  return results;
}


export function calculateClosing_costs_calculator(input: Closing_costs_calculatorInput): Closing_costs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalClosingCosts"]);
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


export interface Closing_costs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
