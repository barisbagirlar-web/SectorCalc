// @ts-nocheck
// Auto-generated from whole-30-calculator-schema.json
import * as z from 'zod';

export interface Whole_30_calculatorInput {
  dailyDemand: number;
  costPerKg: number;
  wasteRate: number;
  days: number;
}

export const Whole_30_calculatorInputSchema = z.object({
  dailyDemand: z.number().default(100),
  costPerKg: z.number().default(2.5),
  wasteRate: z.number().default(5),
  days: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Whole_30_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dailyDemand * input.days * (1 + input.wasteRate/100); results["totalMaterial"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMaterial"] = 0; }
  try { const v = input.dailyDemand * input.days * input.wasteRate / 100; results["wasteAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteAmount"] = 0; }
  try { const v = input.dailyDemand * input.days * (1 + input.wasteRate/100) * input.costPerKg; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.dailyDemand * input.days * (input.wasteRate/100) * input.costPerKg; results["wasteCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWhole_30_calculator(input: Whole_30_calculatorInput): Whole_30_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Whole_30_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
