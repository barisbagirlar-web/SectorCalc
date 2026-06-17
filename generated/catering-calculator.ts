// Auto-generated from catering-calculator-schema.json
import * as z from 'zod';

export interface Catering_calculatorInput {
  numberOfGuests: number;
  costPerMeal: number;
  numberOfCourses: number;
  serviceChargePercent: number;
  wasteFactor: number;
  vatRate: number;
}

export const Catering_calculatorInputSchema = z.object({
  numberOfGuests: z.number().default(50),
  costPerMeal: z.number().default(75),
  numberOfCourses: z.number().default(3),
  serviceChargePercent: z.number().default(10),
  wasteFactor: z.number().default(5),
  vatRate: z.number().default(18),
});

function evaluateAllFormulas(input: Catering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.costPerMeal * input.numberOfCourses; results["totalRawCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalRawCost"] = 0; }
  try { const v = (results["totalRawCost"] ?? 0) * (input.wasteFactor / 100); results["wasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (results["totalRawCost"] ?? 0) * (input.serviceChargePercent / 100); results["serviceCost"] = Number.isFinite(v) ? v : 0; } catch { results["serviceCost"] = 0; }
  try { const v = (results["totalRawCost"] ?? 0) + (results["wasteCost"] ?? 0) + (results["serviceCost"] ?? 0); results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) * (input.vatRate / 100); results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) + (results["vatAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.numberOfGuests; results["costPerGuest"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


export function calculateCatering_calculator(input: Catering_calculatorInput): Catering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRawCost"] ?? 0;
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


export interface Catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
