// @ts-nocheck
// Auto-generated from iron-intake-calculator-schema.json
import * as z from 'zod';

export interface Iron_intake_calculatorInput {
  oreMass: number;
  ironConcentration: number;
  moistureContent: number;
  recoveryRate: number;
}

export const Iron_intake_calculatorInputSchema = z.object({
  oreMass: z.number().default(100),
  ironConcentration: z.number().default(62),
  moistureContent: z.number().default(8),
  recoveryRate: z.number().default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Iron_intake_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.oreMass * (1 - input.moistureContent / 100); results["dryMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dryMass"] = 0; }
  try { const v = (asFormulaNumber(results["dryMass"])) * (input.ironConcentration / 100); results["ironMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ironMass"] = 0; }
  try { const v = (asFormulaNumber(results["ironMass"])) * (input.recoveryRate / 100); results["netIron"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netIron"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIron_intake_calculator(input: Iron_intake_calculatorInput): Iron_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netIron"]);
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


export interface Iron_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
