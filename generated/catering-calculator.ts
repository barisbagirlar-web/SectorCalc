// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Catering_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfGuests * input.costPerMeal * input.numberOfCourses; results["totalRawCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRawCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRawCost"])) * (input.wasteFactor / 100); results["wasteCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRawCost"])) * (input.serviceChargePercent / 100); results["serviceCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["serviceCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRawCost"])) + (asFormulaNumber(results["wasteCost"])) + (asFormulaNumber(results["serviceCost"])); results["taxableAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) * (input.vatRate / 100); results["vatAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) + (asFormulaNumber(results["vatAmount"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.numberOfGuests; results["costPerGuest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCatering_calculator(input: Catering_calculatorInput): Catering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRawCost"]);
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


export interface Catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
