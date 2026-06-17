// @ts-nocheck
// Auto-generated from critical-path-calculator-schema.json
import * as z from 'zod';

export interface Critical_path_calculatorInput {
  durationA: number;
  durationB: number;
  durationC: number;
  durationD: number;
  durationE: number;
}

export const Critical_path_calculatorInputSchema = z.object({
  durationA: z.number().default(1),
  durationB: z.number().default(1),
  durationC: z.number().default(1),
  durationD: z.number().default(1),
  durationE: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Critical_path_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  results["criticalPath"] = 0;
  try { const v = 'A-C-D: ' + (input.durationA+input.durationC+input.durationD) + ' gün, A-C-E: ' + (input.durationA+input.durationC+input.durationE) + ' gün, B-C-D: ' + (input.durationB+input.durationC+input.durationD) + ' gün, B-C-E: ' + (input.durationB+input.durationC+input.durationE) + ' gün'; results["pathDurations"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pathDurations"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCritical_path_calculator(input: Critical_path_calculatorInput): Critical_path_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pathDurations"]);
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


export interface Critical_path_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
