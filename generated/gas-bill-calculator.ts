// Auto-generated from gas-bill-calculator-schema.json
import * as z from 'zod';

export interface Gas_bill_calculatorInput {
  consumption: number;
  calorificValue: number;
  unitRate: number;
  standingCharge: number;
  vatRate: number;
  dataConfidence?: number;
}

export const Gas_bill_calculatorInputSchema = z.object({
  consumption: z.number().default(0),
  calorificValue: z.number().default(11.2),
  unitRate: z.number().default(0.04),
  standingCharge: z.number().default(10),
  vatRate: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gas_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consumption * input.calorificValue; results["energyConsumed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyConsumed"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyConsumed"])) * input.unitRate; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyCost"])) + input.standingCharge; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) + (toNumericFormulaValue(results["vatAmount"])); results["totalBill"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBill"] = Number.NaN; }
  return results;
}


export function calculateGas_bill_calculator(input: Gas_bill_calculatorInput): Gas_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBill"]);
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


export interface Gas_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
