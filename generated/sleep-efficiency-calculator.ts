// Auto-generated from sleep-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Sleep_efficiency_calculatorInput {
  timeInBed: number;
  sleepLatency: number;
  waso: number;
  awakenings: number;
  dataConfidence?: number;
}

export const Sleep_efficiency_calculatorInputSchema = z.object({
  timeInBed: z.number().default(480),
  sleepLatency: z.number().default(30),
  waso: z.number().default(30),
  awakenings: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sleep_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeInBed - input.sleepLatency - input.waso; results["totalSleepTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSleepTime"] = 0; }
  try { const v = ((asFormulaNumber(results["totalSleepTime"])) / input.timeInBed) * 100; results["sleepEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sleepEfficiency"] = 0; }
  try { const v = (asFormulaNumber(results["sleepEfficiency"])) - input.awakenings * 2; results["qualityScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["qualityScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSleep_efficiency_calculator(input: Sleep_efficiency_calculatorInput): Sleep_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["sleepEfficiency"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Sleep_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
