// Auto-generated from square-fee-calculator-schema.json
import * as z from 'zod';

export interface Square_fee_calculatorInput {
  length: number;
  width: number;
  pricePerSquareMeter: number;
  taxRate: number;
  serviceFee: number;
  dataConfidence?: number;
}

export const Square_fee_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(10),
  pricePerSquareMeter: z.number().default(100),
  taxRate: z.number().default(0),
  serviceFee: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Square_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = (asFormulaNumber(results["area"])) * input.pricePerSquareMeter; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.serviceFee; results["serviceFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + (asFormulaNumber(results["taxAmount"])) + input.serviceFee; results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSquare_fee_calculator(input: Square_fee_calculatorInput): Square_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFee"]);
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


export interface Square_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
