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

function evaluateAllFormulas(input: Per_diem_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals); results["dailyTotal"] = Number.isFinite(v) ? v : 0; } catch { results["dailyTotal"] = 0; }
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals) * input.days; results["totalDaysCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDaysCost"] = 0; }
  try { const v = (input.dailyMeal + input.dailyLodging + input.incidentals) * input.days * input.exchangeRate; results["totalAllowance"] = Number.isFinite(v) ? v : 0; } catch { results["totalAllowance"] = 0; }
  return results;
}


export function calculatePer_diem_calculator(input: Per_diem_calculatorInput): Per_diem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalAllowance"] ?? 0;
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


export interface Per_diem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
