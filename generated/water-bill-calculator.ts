// Auto-generated from water-bill-calculator-schema.json
import * as z from 'zod';

export interface Water_bill_calculatorInput {
  previousMeterReading: number;
  currentMeterReading: number;
  fixedCharge: number;
  ratePerCubicMeter: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Water_bill_calculatorInputSchema = z.object({
  previousMeterReading: z.number().default(0),
  currentMeterReading: z.number().default(0),
  fixedCharge: z.number().default(5),
  ratePerCubicMeter: z.number().default(1.5),
  taxRate: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Water_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentMeterReading - input.previousMeterReading; results["consumptionM3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["consumptionM3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["consumptionM3"])) * input.ratePerCubicMeter; results["waterUsageCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterUsageCost"] = Number.NaN; }
  try { const v = input.fixedCharge; results["fixedCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fixedCharge"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["waterUsageCost"])) + input.fixedCharge) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["waterUsageCost"])) + input.fixedCharge + (toNumericFormulaValue(results["taxAmount"])); results["totalBill"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBill"] = Number.NaN; }
  return results;
}


export function calculateWater_bill_calculator(input: Water_bill_calculatorInput): Water_bill_calculatorOutput {
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


export interface Water_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
