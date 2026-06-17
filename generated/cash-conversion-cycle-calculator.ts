// @ts-nocheck
// Auto-generated from cash-conversion-cycle-calculator-schema.json
import * as z from 'zod';

export interface Cash_conversion_cycle_calculatorInput {
  averageInventory: number;
  cogs: number;
  averageReceivables: number;
  revenue: number;
  averagePayables: number;
  daysInPeriod: number;
}

export const Cash_conversion_cycle_calculatorInputSchema = z.object({
  averageInventory: z.number().default(0),
  cogs: z.number().default(0),
  averageReceivables: z.number().default(0),
  revenue: z.number().default(0),
  averagePayables: z.number().default(0),
  daysInPeriod: z.number().default(365),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cash_conversion_cycle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.averageInventory / input.cogs * input.daysInPeriod; results["dio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dio"] = 0; }
  try { const v = input.averageReceivables / input.revenue * input.daysInPeriod; results["dso"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dso"] = 0; }
  try { const v = input.averagePayables / input.cogs * input.daysInPeriod; results["dpo"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dpo"] = 0; }
  try { const v = (input.averageInventory / input.cogs * input.daysInPeriod) + (input.averageReceivables / input.revenue * input.daysInPeriod) - (input.averagePayables / input.cogs * input.daysInPeriod); results["cashConversionCycle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cashConversionCycle"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCash_conversion_cycle_calculator(input: Cash_conversion_cycle_calculatorInput): Cash_conversion_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cashConversionCycle"]);
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


export interface Cash_conversion_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
