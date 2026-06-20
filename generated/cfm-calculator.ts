// Auto-generated from cfm-calculator-schema.json
import * as z from 'zod';

export interface Cfm_calculatorInput {
  airVelocity: number;
  ductWidth: number;
  ductHeight: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Cfm_calculatorInputSchema = z.object({
  airVelocity: z.number().default(500),
  ductWidth: z.number().default(12),
  ductHeight: z.number().default(8),
  safetyFactor: z.number().default(1.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cfm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ductWidth * input.ductHeight / 144; results["areaSqft"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaSqft"] = Number.NaN; }
  try { const v = input.airVelocity * (toNumericFormulaValue(results["areaSqft"])) * input.safetyFactor; results["cfm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cfm"] = Number.NaN; }
  return results;
}


export function calculateCfm_calculator(input: Cfm_calculatorInput): Cfm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cfm"]);
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


export interface Cfm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
