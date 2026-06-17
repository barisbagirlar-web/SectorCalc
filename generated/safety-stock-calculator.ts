// @ts-nocheck
// Auto-generated from safety-stock-calculator-schema.json
import * as z from 'zod';

export interface Safety_stock_calculatorInput {
  serviceLevelZ: number;
  demandAvg: number;
  demandStdDev: number;
  leadTime: number;
  leadTimeStdDev: number;
}

export const Safety_stock_calculatorInputSchema = z.object({
  serviceLevelZ: z.number().default(1.65),
  demandAvg: z.number().default(100),
  demandStdDev: z.number().default(20),
  leadTime: z.number().default(5),
  leadTimeStdDev: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Safety_stock_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.serviceLevelZ * input.demandAvg * input.leadTimeStdDev; results["leadTimeVariabilityComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leadTimeVariabilityComponent"] = 0; }
  try { const v = input.serviceLevelZ * input.demandAvg * input.leadTimeStdDev; results["leadTimeVariabilityComponent_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leadTimeVariabilityComponent_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSafety_stock_calculator(input: Safety_stock_calculatorInput): Safety_stock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["leadTimeVariabilityComponent_aux"]);
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


export interface Safety_stock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
