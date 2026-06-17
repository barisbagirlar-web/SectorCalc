// @ts-nocheck
// Auto-generated from rowing-erg-calculator-schema.json
import * as z from 'zod';

export interface Rowing_erg_calculatorInput {
  time: number;
  distance: number;
  weight: number;
  strokeRate: number;
  dragFactor: number;
}

export const Rowing_erg_calculatorInputSchema = z.object({
  time: z.number().default(0),
  distance: z.number().default(0),
  weight: z.number().default(70),
  strokeRate: z.number().default(20),
  dragFactor: z.number().default(120),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rowing_erg_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.time > 0 && input.distance > 0) ? (input.time / input.distance) * 500 : 0; results["split"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["split"] = 0; }
  try { const v = (input.time > 0 && input.distance > 0) ? 2.80 / ((input.time / input.distance) * 500) ** 3 : 0; results["power"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["power"] = 0; }
  try { const v = (input.time > 0 && input.distance > 0) ? ((input.time / input.distance) * 500) / 60 : 0; results["pace"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pace"] = 0; }
  try { const v = (input.time > 0) ? input.distance / input.time : 0; results["speed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speed"] = 0; }
  try { const v = (input.time > 0 && input.distance > 0 && input.strokeRate > 0) ? (input.distance * 60) / (input.time * input.strokeRate) : 0; results["distancePerStroke"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distancePerStroke"] = 0; }
  try { const v = (input.time > 0 && input.distance > 0 && input.weight > 0) ? (2.80 / ((input.time / input.distance) * 500) ** 3) / input.weight : 0; results["powerPerWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerPerWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRowing_erg_calculator(input: Rowing_erg_calculatorInput): Rowing_erg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["power"]);
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


export interface Rowing_erg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
