// @ts-nocheck
// Auto-generated from fuel-tax-calculator-schema.json
import * as z from 'zod';

export interface Fuel_tax_calculatorInput {
  fuelQuantity: number;
  pricePerLiter: number;
  vatRate: number;
  exciseTaxPerLiter: number;
}

export const Fuel_tax_calculatorInputSchema = z.object({
  fuelQuantity: z.number().default(100),
  pricePerLiter: z.number().default(1.5),
  vatRate: z.number().default(18),
  exciseTaxPerLiter: z.number().default(0.8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fuel_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fuelQuantity * input.pricePerLiter; results["baseCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = (asFormulaNumber(results["baseCost"])) * (input.vatRate / 100); results["vatAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = input.fuelQuantity * input.exciseTaxPerLiter; results["exciseAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exciseAmount"] = 0; }
  try { const v = (asFormulaNumber(results["baseCost"])) + (asFormulaNumber(results["vatAmount"])) + (asFormulaNumber(results["exciseAmount"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFuel_tax_calculator(input: Fuel_tax_calculatorInput): Fuel_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Fuel_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
