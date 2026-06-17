// @ts-nocheck
// Auto-generated from per-diem-calculator-schema.json
import * as z from 'zod';

export interface Per_diem_calculatorInput {
  days: number;
  dailyMeal: number;
  dailyLodging: number;
  incidentals: number;
  exchangeRate: number;
}

export const Per_diem_calculatorInputSchema = z.object({
  days: z.number().default(1),
  dailyMeal: z.number().default(50),
  dailyLodging: z.number().default(100),
  incidentals: z.number().default(20),
  exchangeRate: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Per_diem_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals); results["dailyTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyTotal"] = 0; }
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals) * input.days; results["totalDaysCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDaysCost"] = 0; }
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals) * input.days * input.exchangeRate; results["totalAllowance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalAllowance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePer_diem_calculator(input: Per_diem_calculatorInput): Per_diem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAllowance"]);
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


export interface Per_diem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
