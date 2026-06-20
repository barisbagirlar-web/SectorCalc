// Auto-generated from catering-calculator-schema.json
import * as z from 'zod';

export interface Catering_calculatorInput {
  numberOfGuests: number;
  costPerMeal: number;
  numberOfCourses: number;
  serviceChargePercent: number;
  wasteFactor: number;
  vatRate: number;
  dataConfidence?: number;
}

export const Catering_calculatorInputSchema = z.object({
  numberOfGuests: z.number().default(50),
  costPerMeal: z.number().default(75),
  numberOfCourses: z.number().default(3),
  serviceChargePercent: z.number().default(10),
  wasteFactor: z.number().default(5),
  vatRate: z.number().default(18),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Catering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.costPerMeal * input.numberOfCourses; results["totalRawCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRawCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRawCost"])) * (input.wasteFactor / 100); results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRawCost"])) * (input.serviceChargePercent / 100); results["serviceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["serviceCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRawCost"])) + (toNumericFormulaValue(results["wasteCost"])) + (toNumericFormulaValue(results["serviceCost"])); results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) * (input.vatRate / 100); results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) + (toNumericFormulaValue(results["vatAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.numberOfGuests; results["costPerGuest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGuest"] = Number.NaN; }
  return results;
}


export function calculateCatering_calculator(input: Catering_calculatorInput): Catering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRawCost"]);
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


export interface Catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
