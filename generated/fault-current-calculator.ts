// @ts-nocheck
// Auto-generated from fault-current-calculator-schema.json
import * as z from 'zod';

export interface Fault_current_calculatorInput {
  primaryVoltage: number;
  secondaryVoltage: number;
  sourceSCMVA: number;
  transformerKVA: number;
  transformerPercentZ: number;
}

export const Fault_current_calculatorInputSchema = z.object({
  primaryVoltage: z.number().default(34.5),
  secondaryVoltage: z.number().default(480),
  sourceSCMVA: z.number().default(500),
  transformerKVA: z.number().default(1000),
  transformerPercentZ: z.number().default(5.75),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fault_current_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.primaryVoltage + input.secondaryVoltage + input.sourceSCMVA; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.primaryVoltage + input.secondaryVoltage + input.sourceSCMVA; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFault_current_calculator(input: Fault_current_calculatorInput): Fault_current_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Fault_current_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
