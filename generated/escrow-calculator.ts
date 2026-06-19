// Auto-generated from escrow-calculator-schema.json
import * as z from 'zod';

export interface Escrow_calculatorInput {
  annualPropertyTax: number;
  annualInsurancePremium: number;
  cushionMonths: number;
  monthsPerYear: number;
  dataConfidence?: number;
}

export const Escrow_calculatorInputSchema = z.object({
  annualPropertyTax: z.number().default(5000),
  annualInsurancePremium: z.number().default(1200),
  cushionMonths: z.number().default(2),
  monthsPerYear: z.number().default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Escrow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualPropertyTax + input.annualInsurancePremium) / input.monthsPerYear; results["monthlyEscrowPayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyEscrowPayment"] = 0; }
  try { const v = input.annualPropertyTax + input.annualInsurancePremium; results["totalAnnualEscrow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAnnualEscrow"] = 0; }
  try { const v = (input.annualPropertyTax + input.annualInsurancePremium) / input.monthsPerYear * input.cushionMonths; results["cushionAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cushionAmount"] = 0; }
  try { const v = (input.annualPropertyTax + input.annualInsurancePremium) / input.monthsPerYear * (1 + input.cushionMonths); results["initialDeposit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["initialDeposit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEscrow_calculator(input: Escrow_calculatorInput): Escrow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["monthlyEscrowPayment"]));
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


export interface Escrow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
