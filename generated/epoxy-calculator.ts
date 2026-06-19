// Auto-generated from epoxy-calculator-schema.json
import * as z from 'zod';

export interface Epoxy_calculatorInput {
  desiredWeight: number;
  resinRatio: number;
  hardenerRatio: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Epoxy_calculatorInputSchema = z.object({
  desiredWeight: z.number().default(1),
  resinRatio: z.number().default(100),
  hardenerRatio: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Epoxy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resinRatio + input.hardenerRatio; results["totalParts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalParts"] = 0; }
  try { const v = input.desiredWeight * (1 + input.wasteFactor/100); results["adjustedWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedWeight"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedWeight"])) * input.resinRatio / (asFormulaNumber(results["totalParts"])); results["resinWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resinWeight"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedWeight"])) * input.hardenerRatio / (asFormulaNumber(results["totalParts"])); results["hardenerWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hardenerWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEpoxy_calculator(input: Epoxy_calculatorInput): Epoxy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedWeight"]);
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


export interface Epoxy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
