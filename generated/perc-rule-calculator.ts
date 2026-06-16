// Auto-generated from perc-rule-calculator-schema.json
import * as z from 'zod';

export interface Perc_rule_calculatorInput {
  plannedTime: number;
  operatingTime: number;
  idealCycleTime: number;
  totalUnits: number;
  defects: number;
}

export const Perc_rule_calculatorInputSchema = z.object({
  plannedTime: z.number().default(480),
  operatingTime: z.number().default(460),
  idealCycleTime: z.number().default(30),
  totalUnits: z.number().default(900),
  defects: z.number().default(10),
});

function evaluateAllFormulas(input: Perc_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operatingTime / input.plannedTime; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.idealCycleTime * input.totalUnits) / (input.operatingTime * 60); results["performance"] = Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = (input.totalUnits - input.defects) / input.totalUnits; results["quality"] = Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = (results["availability"] ?? 0) * (results["performance"] ?? 0) * (results["quality"] ?? 0); results["oee"] = Number.isFinite(v) ? v : 0; } catch { results["oee"] = 0; }
  return results;
}


export function calculatePerc_rule_calculator(input: Perc_rule_calculatorInput): Perc_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oee"] ?? 0;
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


export interface Perc_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
