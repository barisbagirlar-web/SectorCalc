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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cfm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ductWidth * input.ductHeight / 144; results["areaSqft"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaSqft"] = 0; }
  try { const v = input.airVelocity * (asFormulaNumber(results["areaSqft"])) * input.safetyFactor; results["cfm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cfm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCfm_calculator(input: Cfm_calculatorInput): Cfm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cfm"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
