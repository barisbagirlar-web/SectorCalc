// Auto-generated from biphasic-sleep-calculator-schema.json
import * as z from 'zod';

export interface Biphasic_sleep_calculatorInput {
  wakeTime: number;
  coreDuration: number;
  napDuration: number;
  napTime: number;
  dataConfidence?: number;
}

export const Biphasic_sleep_calculatorInputSchema = z.object({
  wakeTime: z.number().default(7),
  coreDuration: z.number().default(5),
  napDuration: z.number().default(1.5),
  napTime: z.number().default(14),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Biphasic_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wakeTime - input.coreDuration + 24) % 24; results["coreStart"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coreStart"] = 0; }
  try { const v = input.wakeTime; results["coreEnd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coreEnd"] = 0; }
  try { const v = (input.napTime + input.napDuration) % 24; results["napEnd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["napEnd"] = 0; }
  try { const v = input.coreDuration + input.napDuration; results["totalSleep"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSleep"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBiphasic_sleep_calculator(input: Biphasic_sleep_calculatorInput): Biphasic_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalSleep"]));
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


export interface Biphasic_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
