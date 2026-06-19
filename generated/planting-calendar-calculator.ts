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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Planting_calendar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lastFrostDay * input.plantingDateOffset * input.baseTemperature * input.targetGDD; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.lastFrostDay * input.plantingDateOffset * input.baseTemperature * input.targetGDD * (input.averageDailyTemp * input.soilTemp * input.minSoilTemp * input.safetyMargin); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.averageDailyTemp * input.soilTemp * input.minSoilTemp * input.safetyMargin; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePlanting_calendar_calculator(input: Planting_calendar_calculatorInput): Planting_calendar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Planting_calendar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
