// Auto-generated from everyman-sleep-calculator-schema.json
import * as z from 'zod';

export interface Everyman_sleep_calculatorInput {
  coreHours: number;
  coreMinutes: number;
  napCount: number;
  napDuration: number;
  dataConfidence?: number;
}

export const Everyman_sleep_calculatorInputSchema = z.object({
  coreHours: z.number().default(3.5),
  coreMinutes: z.number().default(0),
  napCount: z.number().default(3),
  napDuration: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Everyman_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coreHours * 60 + input.coreMinutes; results["totalCoreMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCoreMinutes"] = 0; }
  try { const v = input.napCount * input.napDuration; results["totalNapMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalNapMinutes"] = 0; }
  try { const v = input.coreHours * 60 + input.coreMinutes + input.napCount * input.napDuration; results["totalMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  try { const v = (input.coreHours * 60 + input.coreMinutes + input.napCount * input.napDuration) / 60; results["totalHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEveryman_sleep_calculator(input: Everyman_sleep_calculatorInput): Everyman_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCoreMinutes"]);
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


export interface Everyman_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
