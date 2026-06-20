// Auto-generated from fuel-tax-calculator-schema.json
import * as z from 'zod';

export interface Fuel_tax_calculatorInput {
  fuelQuantity: number;
  pricePerLiter: number;
  vatRate: number;
  exciseTaxPerLiter: number;
  dataConfidence?: number;
}

export const Fuel_tax_calculatorInputSchema = z.object({
  fuelQuantity: z.number().default(100),
  pricePerLiter: z.number().default(1.5),
  vatRate: z.number().default(18),
  exciseTaxPerLiter: z.number().default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fuel_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelQuantity * input.pricePerLiter; results["baseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) * (input.vatRate / 100); results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = input.fuelQuantity * input.exciseTaxPerLiter; results["exciseAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exciseAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) + (toNumericFormulaValue(results["vatAmount"])) + (toNumericFormulaValue(results["exciseAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateFuel_tax_calculator(input: Fuel_tax_calculatorInput): Fuel_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Fuel_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
