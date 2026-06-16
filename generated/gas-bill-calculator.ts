// Auto-generated from gas-bill-calculator-schema.json
import * as z from 'zod';

export interface Gas_bill_calculatorInput {
  consumption: number;
  calorificValue: number;
  unitRate: number;
  standingCharge: number;
  vatRate: number;
}

export const Gas_bill_calculatorInputSchema = z.object({
  consumption: z.number().default(0),
  calorificValue: z.number().default(11.2),
  unitRate: z.number().default(0.04),
  standingCharge: z.number().default(10),
  vatRate: z.number().default(20),
});

function evaluateAllFormulas(input: Gas_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consumption * input.calorificValue; results["energyConsumed"] = Number.isFinite(v) ? v : 0; } catch { results["energyConsumed"] = 0; }
  try { const v = (results["energyConsumed"] ?? 0) * input.unitRate; results["energyCost"] = Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = (results["energyCost"] ?? 0) + input.standingCharge; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) + (results["vatAmount"] ?? 0); results["totalBill"] = Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  return results;
}


export function calculateGas_bill_calculator(input: Gas_bill_calculatorInput): Gas_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBill"] ?? 0;
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


export interface Gas_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
