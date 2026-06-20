// Auto-generated from per-diem-calculator-schema.json
import * as z from 'zod';

export interface Per_diem_calculatorInput {
  days: number;
  dailyMeal: number;
  dailyLodging: number;
  incidentals: number;
  exchangeRate: number;
  dataConfidence?: number;
}

export const Per_diem_calculatorInputSchema = z.object({
  days: z.number().default(1),
  dailyMeal: z.number().default(50),
  dailyLodging: z.number().default(100),
  incidentals: z.number().default(20),
  exchangeRate: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Per_diem_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals); results["dailyTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyTotal"] = Number.NaN; }
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals) * input.days; results["totalDaysCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDaysCost"] = Number.NaN; }
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals) * input.days * input.exchangeRate; results["totalAllowance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAllowance"] = Number.NaN; }
  return results;
}


export function calculatePer_diem_calculator(input: Per_diem_calculatorInput): Per_diem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAllowance"]);
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


export interface Per_diem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
