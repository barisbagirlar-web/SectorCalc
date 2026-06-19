// Auto-generated from nap-calculator-schema.json
import * as z from 'zod';

export interface Nap_calculatorInput {
  currentTimeHours: number;
  wakeUpTimeHours: number;
  sleepCycleMinutes: number;
  minNapMinutes: number;
  maxNapMinutes: number;
  dataConfidence?: number;
}

export const Nap_calculatorInputSchema = z.object({
  currentTimeHours: z.number().default(14),
  wakeUpTimeHours: z.number().default(17),
  sleepCycleMinutes: z.number().default(90),
  minNapMinutes: z.number().default(10),
  maxNapMinutes: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Nap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wakeUpTimeHours - input.currentTimeHours) * 60; results["availableMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["availableMinutes"] = 0; }
  try { const v = ((asFormulaNumber(results["availableMinutes"])) >= input.sleepCycleMinutes) ? input.sleepCycleMinutes : (((asFormulaNumber(results["availableMinutes"])) >= input.minNapMinutes) ? input.minNapMinutes : 0); results["recommendedNapMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recommendedNapMinutes"] = 0; }
  try { const v = input.currentTimeHours + input.sleepCycleMinutes/60; results["cycleNapWakeTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cycleNapWakeTime"] = 0; }
  try { const v = input.currentTimeHours + input.minNapMinutes/60; results["shortNapWakeTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shortNapWakeTime"] = 0; }
  try { const v = input.currentTimeHours + input.maxNapMinutes/60; results["maxNapWakeTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxNapWakeTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNap_calculator(input: Nap_calculatorInput): Nap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["availableMinutes"]));
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


export interface Nap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
