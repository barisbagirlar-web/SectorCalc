// Auto-generated from duty-calculator-schema.json
import * as z from 'zod';

export interface Duty_calculatorInput {
  productValue: number;
  insurance: number;
  freight: number;
  dutyRate: number;
  vatRate: number;
}

export const Duty_calculatorInputSchema = z.object({
  productValue: z.number().default(1000),
  insurance: z.number().default(100),
  freight: z.number().default(200),
  dutyRate: z.number().default(10),
  vatRate: z.number().default(18),
});

function evaluateAllFormulas(input: Duty_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productValue + input.insurance + input.freight; results["cifValue"] = Number.isFinite(v) ? v : 0; } catch { results["cifValue"] = 0; }
  try { const v = (results["cifValue"] ?? 0) * input.dutyRate / 100; results["dutyAmount"] = Number.isFinite(v) ? v : 0; } catch { results["dutyAmount"] = 0; }
  try { const v = ((results["cifValue"] ?? 0) + (results["dutyAmount"] ?? 0)) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["cifValue"] ?? 0) + (results["dutyAmount"] ?? 0) + (results["vatAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["dutyAmount"] ?? 0); results["totalDuty"] = Number.isFinite(v) ? v : 0; } catch { results["totalDuty"] = 0; }
  return results;
}


export function calculateDuty_calculator(input: Duty_calculatorInput): Duty_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDuty"] ?? 0;
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


export interface Duty_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
