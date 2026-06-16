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

function evaluateAllFormulas(input: Camping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfCampers * input.waterPerPerson * input.numberOfNights * (1 + input.temperatureAdjust) * (1 + input.safetyMargin/100); results["totalWater"] = Number.isFinite(v) ? v : 0; } catch { results["totalWater"] = 0; }
  try { const v = input.numberOfCampers * input.foodPerPerson * input.numberOfNights * (1 + input.safetyMargin/100); results["totalFood"] = Number.isFinite(v) ? v : 0; } catch { results["totalFood"] = 0; }
  try { const v = input.firewoodPerNight * input.numberOfNights * (1 + input.safetyMargin/100); results["totalFirewood"] = Number.isFinite(v) ? v : 0; } catch { results["totalFirewood"] = 0; }
  return results;
}


export function calculateCamping_calculator(input: Camping_calculatorInput): Camping_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWater"] ?? 0;
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


export interface Camping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
