// Auto-generated from relative-risk-calculator-schema.json
import * as z from 'zod';

export interface Relative_risk_calculatorInput {
  exposed_events: number;
  exposed_total: number;
  control_events: number;
  control_total: number;
  dataConfidence?: number;
}

export const Relative_risk_calculatorInputSchema = z.object({
  exposed_events: z.number().default(10),
  exposed_total: z.number().default(100),
  control_events: z.number().default(5),
  control_total: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Relative_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exposed_events / input.exposed_total; results["risk_exposed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["risk_exposed"] = 0; }
  try { const v = input.control_events / input.control_total; results["risk_unexposed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["risk_unexposed"] = 0; }
  try { const v = (input.exposed_events / input.exposed_total) / (input.control_events / input.control_total); results["relative_risk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["relative_risk"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRelative_risk_calculator(input: Relative_risk_calculatorInput): Relative_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["relative_risk"]);
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


export interface Relative_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
