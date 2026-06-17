// @ts-nocheck
// Auto-generated from fluoride-calculator-schema.json
import * as z from 'zod';

export interface Fluoride_calculatorInput {
  waterFlowRate: number;
  targetFluorideConc: number;
  rawFluorideConc: number;
  compoundPurity: number;
  fluorideIonPercent: number;
}

export const Fluoride_calculatorInputSchema = z.object({
  waterFlowRate: z.number().default(1000),
  targetFluorideConc: z.number().default(1),
  rawFluorideConc: z.number().default(0.2),
  compoundPurity: z.number().default(98),
  fluorideIonPercent: z.number().default(45),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fluoride_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.waterFlowRate * (input.targetFluorideConc - input.rawFluorideConc); results["fluorideDemand_g_per_day"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fluorideDemand_g_per_day"] = 0; }
  try { const v = (asFormulaNumber(results["fluorideDemand_g_per_day"])) / ((input.compoundPurity / 100) * (input.fluorideIonPercent / 100)); results["compoundMass_g_per_day"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["compoundMass_g_per_day"] = 0; }
  try { const v = (asFormulaNumber(results["compoundMass_g_per_day"])) / 1000; results["compoundFeedRate_kg_per_day"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["compoundFeedRate_kg_per_day"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFluoride_calculator(input: Fluoride_calculatorInput): Fluoride_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fluorideDemand_g_per_day"]);
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


export interface Fluoride_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
