// Auto-generated from ridge-vent-calculator-schema.json
import * as z from 'zod';

export interface Ridge_vent_calculatorInput {
  atticArea: number;
  ventRatio: number;
  nfaPerFoot: number;
  splitFactor: number;
  dataConfidence?: number;
}

export const Ridge_vent_calculatorInputSchema = z.object({
  atticArea: z.number().default(1500),
  ventRatio: z.number().default(150),
  nfaPerFoot: z.number().default(18),
  splitFactor: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ridge_vent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atticArea / input.ventRatio; results["totalNFA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalNFA"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalNFA"])) * input.splitFactor; results["ridgeNFA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ridgeNFA"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ridgeNFA"])) * 144 / input.nfaPerFoot; results["requiredLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredLength"] = Number.NaN; }
  return results;
}


export function calculateRidge_vent_calculator(input: Ridge_vent_calculatorInput): Ridge_vent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalNFA"]);
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


export interface Ridge_vent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
