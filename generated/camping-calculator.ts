// Auto-generated from camping-calculator-schema.json
import * as z from 'zod';

export interface Camping_calculatorInput {
  numberOfCampers: number;
  numberOfNights: number;
  waterPerPerson: number;
  foodPerPerson: number;
  firewoodPerNight: number;
  temperatureAdjust: number;
  safetyMargin: number;
  dataConfidence?: number;
}

export const Camping_calculatorInputSchema = z.object({
  numberOfCampers: z.number().default(1),
  numberOfNights: z.number().default(2),
  waterPerPerson: z.number().default(5),
  foodPerPerson: z.number().default(2500),
  firewoodPerNight: z.number().default(10),
  temperatureAdjust: z.number().default(0),
  safetyMargin: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Camping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfCampers * input.waterPerPerson * input.numberOfNights * (1 + input.temperatureAdjust) * (1 + input.safetyMargin/100); results["totalWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWater"] = Number.NaN; }
  try { const v = input.numberOfCampers * input.foodPerPerson * input.numberOfNights * (1 + input.safetyMargin/100); results["totalFood"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFood"] = Number.NaN; }
  try { const v = input.firewoodPerNight * input.numberOfNights * (1 + input.safetyMargin/100); results["totalFirewood"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFirewood"] = Number.NaN; }
  return results;
}


export function calculateCamping_calculator(input: Camping_calculatorInput): Camping_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWater"]);
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


export interface Camping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
