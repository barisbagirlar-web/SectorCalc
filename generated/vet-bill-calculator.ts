// Auto-generated from vet-bill-calculator-schema.json
import * as z from 'zod';

export interface Vet_bill_calculatorInput {
  consultationFee: number;
  medicationCost: number;
  procedureCost: number;
  labTestsCost: number;
  discountPercent: number;
  dataConfidence?: number;
}

export const Vet_bill_calculatorInputSchema = z.object({
  consultationFee: z.number().default(0),
  medicationCost: z.number().default(0),
  procedureCost: z.number().default(0),
  labTestsCost: z.number().default(0),
  discountPercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vet_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consultationFee + input.medicationCost + input.procedureCost + input.labTestsCost; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) - (asFormulaNumber(results["discountAmount"])); results["totalBill"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVet_bill_calculator(input: Vet_bill_calculatorInput): Vet_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalBill"]));
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


export interface Vet_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
