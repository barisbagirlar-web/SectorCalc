// Auto-generated from planting-calendar-calculator-schema.json
import * as z from 'zod';

export interface Planting_calendar_calculatorInput {
  lastFrostDay: number;
  plantingDateOffset: number;
  baseTemperature: number;
  targetGDD: number;
  averageDailyTemp: number;
  soilTemp: number;
  minSoilTemp: number;
  safetyMargin: number;
}

export const Planting_calendar_calculatorInputSchema = z.object({
  lastFrostDay: z.number().default(120),
  plantingDateOffset: z.number().default(7),
  baseTemperature: z.number().default(10),
  targetGDD: z.number().default(1500),
  averageDailyTemp: z.number().default(20),
  soilTemp: z.number().default(14),
  minSoilTemp: z.number().default(10),
  safetyMargin: z.number().default(10),
});

function evaluateAllFormulas(input: Planting_calendar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.averageDailyTemp - input.baseTemperature); results["dailyGDD"] = Number.isFinite(v) ? v : 0; } catch { results["dailyGDD"] = 0; }
  try { const v = Math.ceil(Math.max(0, (input.minSoilTemp - input.soilTemp) / 0.3)); results["soilAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["soilAdjustment"] = 0; }
  try { const v = input.lastFrostDay + input.plantingDateOffset + Math.ceil(Math.max(0, (input.minSoilTemp - input.soilTemp) / 0.3)); results["recommendedPlantingDay"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedPlantingDay"] = 0; }
  try { const v = Math.ceil(input.targetGDD / Math.max(0.001, Math.max(0, input.averageDailyTemp - input.baseTemperature))) + input.safetyMargin; results["daysToMaturity"] = Number.isFinite(v) ? v : 0; } catch { results["daysToMaturity"] = 0; }
  try { const v = ((input.lastFrostDay + input.plantingDateOffset + Math.ceil(Math.max(0, (input.minSoilTemp - input.soilTemp) / 0.3)) + (Math.ceil(input.targetGDD / Math.max(0.001, Math.max(0, input.averageDailyTemp - input.baseTemperature))) + input.safetyMargin) - 1) % 365 + 1); results["estimatedHarvestDay"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedHarvestDay"] = 0; }
  try { const v = Math.ceil(input.targetGDD / Math.max(0.001, Math.max(0, input.averageDailyTemp - input.baseTemperature))); results["growingDays"] = Number.isFinite(v) ? v : 0; } catch { results["growingDays"] = 0; }
  try { const v = Math.ceil(input.targetGDD / Math.max(0.001, Math.max(0, input.averageDailyTemp - input.baseTemperature))) + input.safetyMargin; results["daysToHarvest"] = Number.isFinite(v) ? v : 0; } catch { results["daysToHarvest"] = 0; }
  return results;
}


export function calculatePlanting_calendar_calculator(input: Planting_calendar_calculatorInput): Planting_calendar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedPlantingDay"] ?? 0;
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


export interface Planting_calendar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
