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

function evaluateAllFormulas(input: Water_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentMeterReading - input.previousMeterReading; results["consumptionM3"] = Number.isFinite(v) ? v : 0; } catch { results["consumptionM3"] = 0; }
  try { const v = (results["consumptionM3"] ?? 0) * input.ratePerCubicMeter; results["waterUsageCost"] = Number.isFinite(v) ? v : 0; } catch { results["waterUsageCost"] = 0; }
  try { const v = input.fixedCharge; results["fixedCharge"] = Number.isFinite(v) ? v : 0; } catch { results["fixedCharge"] = 0; }
  try { const v = ((results["waterUsageCost"] ?? 0) + input.fixedCharge) * input.taxRate / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["waterUsageCost"] ?? 0) + input.fixedCharge + (results["taxAmount"] ?? 0); results["totalBill"] = Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  return results;
}


export function calculateWater_bill_calculator(input: Water_bill_calculatorInput): Water_bill_calculatorOutput {
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


export interface Water_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
