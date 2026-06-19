// Auto-generated from risk-ratio-calculator-schema.json
import * as z from 'zod';

export interface Risk_ratio_calculatorInput {
  exposedEvents: number;
  exposedTotal: number;
  controlEvents: number;
  controlTotal: number;
  dataConfidence?: number;
}

export const Risk_ratio_calculatorInputSchema = z.object({
  exposedEvents: z.number().default(0),
  exposedTotal: z.number().default(0),
  controlEvents: z.number().default(0),
  controlTotal: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Risk_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exposedEvents / input.exposedTotal; results["exposedRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exposedRisk"] = 0; }
  try { const v = input.controlEvents / input.controlTotal; results["controlRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["controlRisk"] = 0; }
  try { const v = (input.exposedEvents * input.controlTotal) / (input.exposedTotal * input.controlEvents); results["riskRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRisk_ratio_calculator(input: Risk_ratio_calculatorInput): Risk_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["riskRatio"]));
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


export interface Risk_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
