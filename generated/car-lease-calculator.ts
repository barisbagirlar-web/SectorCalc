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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Car_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carPrice - input.downPayment + input.acquisitionFee; results["netCapCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netCapCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netCapCost"])) - input.residualValue) / input.leaseTerm; results["depreciationFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["depreciationFee"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netCapCost"])) + input.residualValue) * input.moneyFactor; results["financeFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financeFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["depreciationFee"])) + (toNumericFormulaValue(results["financeFee"])); results["monthlyPaymentBeforeTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPaymentBeforeTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPaymentBeforeTax"])) * (1 + input.salesTaxRate / 100); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPayment"])) * input.leaseTerm + input.downPayment + input.acquisitionFee; results["totalLeaseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLeaseCost"] = Number.NaN; }
  return results;
}


export function calculateCar_lease_calculator(input: Car_lease_calculatorInput): Car_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyPayment"]);
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


export interface Car_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
