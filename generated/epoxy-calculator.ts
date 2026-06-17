// @ts-nocheck
// Auto-generated from epoxy-calculator-schema.json
import * as z from 'zod';

export interface Epoxy_calculatorInput {
  desiredWeight: number;
  resinRatio: number;
  hardenerRatio: number;
  wasteFactor: number;
}

export const Epoxy_calculatorInputSchema = z.object({
  desiredWeight: z.number().default(1),
  resinRatio: z.number().default(100),
  hardenerRatio: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Epoxy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.resinRatio + input.hardenerRatio; results["totalParts"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalParts"] = 0; }
  try { const v = input.desiredWeight * (1 + input.wasteFactor/100); results["adjustedWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedWeight"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedWeight"])) * input.resinRatio / (asFormulaNumber(results["totalParts"])); results["resinWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["resinWeight"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedWeight"])) * input.hardenerRatio / (asFormulaNumber(results["totalParts"])); results["hardenerWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hardenerWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEpoxy_calculator(input: Epoxy_calculatorInput): Epoxy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedWeight"]);
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


export interface Epoxy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
