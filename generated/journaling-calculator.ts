// @ts-nocheck
// Auto-generated from journaling-calculator-schema.json
import * as z from 'zod';

export interface Journaling_calculatorInput {
  shaftDiameter: number;
  bearingLength: number;
  radialLoad: number;
  rotationalSpeed: number;
  oilViscosity: number;
  radialClearance: number;
}

export const Journaling_calculatorInputSchema = z.object({
  shaftDiameter: z.number().default(50),
  bearingLength: z.number().default(80),
  radialLoad: z.number().default(5000),
  rotationalSpeed: z.number().default(1500),
  oilViscosity: z.number().default(30),
  radialClearance: z.number().default(0.05),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Journaling_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.shaftDiameter / 2; results["shaftRadius_mm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shaftRadius_mm"] = 0; }
  try { const v = (asFormulaNumber(results["shaftRadius_mm"])) / 1000; results["shaftRadius_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shaftRadius_m"] = 0; }
  try { const v = input.bearingLength / 1000; results["bearingLength_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bearingLength_m"] = 0; }
  try { const v = input.radialClearance / 1000; results["radialClearance_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["radialClearance_m"] = 0; }
  try { const v = input.oilViscosity * 0.001; results["oilViscosity_Pas"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["oilViscosity_Pas"] = 0; }
  try { const v = input.rotationalSpeed / 60; results["rotationalSpeed_rps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rotationalSpeed_rps"] = 0; }
  try { const v = (input.radialLoad * 1e6) / (input.shaftDiameter * input.bearingLength); results["unitLoadPressure"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unitLoadPressure"] = 0; }
  try { const v = (asFormulaNumber(results["radialClearance_m"])) / (asFormulaNumber(results["shaftRadius_m"])); results["clearanceRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["clearanceRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateJournaling_calculator(input: Journaling_calculatorInput): Journaling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["clearanceRatio"]);
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


export interface Journaling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
