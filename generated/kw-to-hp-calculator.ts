// @ts-nocheck
// Auto-generated from kw-to-hp-calculator-schema.json
import * as z from 'zod';

export interface Kw_to_hp_calculatorInput {
  kW: number;
  efficiency: number;
  loadFactor: number;
  customFactor: number;
}

export const Kw_to_hp_calculatorInputSchema = z.object({
  kW: z.number().default(1),
  efficiency: z.number().default(90),
  loadFactor: z.number().default(100),
  customFactor: z.number().default(1.34102),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kw_to_hp_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.kW * (input.efficiency / 100) * (input.loadFactor / 100); results["effectiveKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveKW"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveKW"])) * 1.34102; results["hp_mechanical"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hp_mechanical"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveKW"])) * 1.35962; results["hp_metric"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hp_metric"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveKW"])) * 1.34048; results["hp_electrical"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hp_electrical"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveKW"])) * input.customFactor; results["hp_custom"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hp_custom"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKw_to_hp_calculator(input: Kw_to_hp_calculatorInput): Kw_to_hp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hp_custom"]);
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


export interface Kw_to_hp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
