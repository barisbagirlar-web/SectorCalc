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

function evaluateAllFormulas(input: Fuel_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelQuantity * input.pricePerLiter; results["baseCost"] = Number.isFinite(v) ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = (results["baseCost"] ?? 0) * (input.vatRate / 100); results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = input.fuelQuantity * input.exciseTaxPerLiter; results["exciseAmount"] = Number.isFinite(v) ? v : 0; } catch { results["exciseAmount"] = 0; }
  try { const v = (results["baseCost"] ?? 0) + (results["vatAmount"] ?? 0) + (results["exciseAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateFuel_tax_calculator(input: Fuel_tax_calculatorInput): Fuel_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
