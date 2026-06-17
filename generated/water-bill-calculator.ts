// @ts-nocheck
// Auto-generated from water-bill-calculator-schema.json
import * as z from 'zod';

export interface Water_bill_calculatorInput {
  previousMeterReading: number;
  currentMeterReading: number;
  fixedCharge: number;
  ratePerCubicMeter: number;
  taxRate: number;
}

export const Water_bill_calculatorInputSchema = z.object({
  previousMeterReading: z.number().default(0),
  currentMeterReading: z.number().default(0),
  fixedCharge: z.number().default(5),
  ratePerCubicMeter: z.number().default(1.5),
  taxRate: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Water_bill_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentMeterReading - input.previousMeterReading; results["consumptionM3"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["consumptionM3"] = 0; }
  try { const v = (asFormulaNumber(results["consumptionM3"])) * input.ratePerCubicMeter; results["waterUsageCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterUsageCost"] = 0; }
  try { const v = input.fixedCharge; results["fixedCharge"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fixedCharge"] = 0; }
  try { const v = ((asFormulaNumber(results["waterUsageCost"])) + input.fixedCharge) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["waterUsageCost"])) + input.fixedCharge + (asFormulaNumber(results["taxAmount"])); results["totalBill"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBill"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWater_bill_calculator(input: Water_bill_calculatorInput): Water_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBill"]);
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


export interface Water_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
