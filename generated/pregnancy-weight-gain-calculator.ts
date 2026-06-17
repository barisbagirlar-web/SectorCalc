// @ts-nocheck
// Auto-generated from pregnancy-weight-gain-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_weight_gain_calculatorInput {
  prePregnancyWeight: number;
  height: number;
  currentWeight: number;
  currentWeek: number;
}

export const Pregnancy_weight_gain_calculatorInputSchema = z.object({
  prePregnancyWeight: z.number().default(60),
  height: z.number().default(165),
  currentWeight: z.number().default(65),
  currentWeek: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pregnancy_weight_gain_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.prePregnancyWeight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = (asFormulaNumber(results["bmi"])) < 18.5 ? 12.5 : (asFormulaNumber(results["bmi"])) < 25 ? 11.5 : (asFormulaNumber(results["bmi"])) < 30 ? 7 : 5; results["totalMinGain"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMinGain"] = 0; }
  try { const v = (asFormulaNumber(results["bmi"])) < 18.5 ? 18 : (asFormulaNumber(results["bmi"])) < 25 ? 16 : (asFormulaNumber(results["bmi"])) < 30 ? 11.5 : 9; results["totalMaxGain"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMaxGain"] = 0; }
  try { const v = (asFormulaNumber(results["totalMinGain"])) * (input.currentWeek / 40); results["minGainCurrent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["minGainCurrent"] = 0; }
  try { const v = (asFormulaNumber(results["totalMaxGain"])) * (input.currentWeek / 40); results["maxGainCurrent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxGainCurrent"] = 0; }
  try { const v = input.prePregnancyWeight + (asFormulaNumber(results["minGainCurrent"])); results["recommendedMinWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recommendedMinWeight"] = 0; }
  try { const v = input.prePregnancyWeight + (asFormulaNumber(results["maxGainCurrent"])); results["recommendedMaxWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recommendedMaxWeight"] = 0; }
  try { const v = input.currentWeight - input.prePregnancyWeight; results["weightGained"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightGained"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePregnancy_weight_gain_calculator(input: Pregnancy_weight_gain_calculatorInput): Pregnancy_weight_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["weightGained"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Pregnancy_weight_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
