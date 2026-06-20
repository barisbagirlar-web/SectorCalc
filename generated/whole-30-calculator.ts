// Auto-generated from whole-30-calculator-schema.json
import * as z from 'zod';

export interface Whole_30_calculatorInput {
  dailyDemand: number;
  costPerKg: number;
  wasteRate: number;
  days: number;
  dataConfidence?: number;
}

export const Whole_30_calculatorInputSchema = z.object({
  dailyDemand: z.number().default(100),
  costPerKg: z.number().default(2.5),
  wasteRate: z.number().default(5),
  days: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Whole_30_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyDemand * input.days * (1 + input.wasteRate/100); results["totalMaterial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterial"] = Number.NaN; }
  try { const v = input.dailyDemand * input.days * input.wasteRate / 100; results["wasteAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteAmount"] = Number.NaN; }
  try { const v = input.dailyDemand * input.days * (1 + input.wasteRate/100) * input.costPerKg; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.dailyDemand * input.days * (input.wasteRate/100) * input.costPerKg; results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteCost"] = Number.NaN; }
  return results;
}


export function calculateWhole_30_calculator(input: Whole_30_calculatorInput): Whole_30_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Whole_30_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
