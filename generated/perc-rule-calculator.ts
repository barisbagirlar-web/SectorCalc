// Auto-generated from perc-rule-calculator-schema.json
import * as z from 'zod';

export interface Perc_rule_calculatorInput {
  plannedTime: number;
  operatingTime: number;
  idealCycleTime: number;
  totalUnits: number;
  defects: number;
  dataConfidence?: number;
}

export const Perc_rule_calculatorInputSchema = z.object({
  plannedTime: z.number().default(480),
  operatingTime: z.number().default(460),
  idealCycleTime: z.number().default(30),
  totalUnits: z.number().default(900),
  defects: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Perc_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operatingTime / input.plannedTime; results["availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["availability"] = Number.NaN; }
  try { const v = (input.idealCycleTime * input.totalUnits) / (input.operatingTime * 60); results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["performance"] = Number.NaN; }
  try { const v = (input.totalUnits - input.defects) / input.totalUnits; results["quality"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quality"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["availability"])) * (toNumericFormulaValue(results["performance"])) * (toNumericFormulaValue(results["quality"])); results["oee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oee"] = Number.NaN; }
  return results;
}


export function calculatePerc_rule_calculator(input: Perc_rule_calculatorInput): Perc_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["oee"]);
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


export interface Perc_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
