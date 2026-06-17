// @ts-nocheck
// Auto-generated from ovulation-calculator-schema.json
import * as z from 'zod';

export interface Ovulation_calculatorInput {
  cycle_length: number;
  luteal_phase_length: number;
  last_period_start: number;
  cycle_variability: number;
  age_group: string;
  has_irregular_cycles: boolean;
}

export const Ovulation_calculatorInputSchema = z.object({
  cycle_length: z.number().min(20).max(45).default(28),
  luteal_phase_length: z.number().min(10).max(16).default(14),
  last_period_start: z.number().min(0).max(2000000000).default(0),
  cycle_variability: z.number().min(0).max(10).default(2),
  age_group: z.enum(['<20', '20-30', '31-40', '>40']).default('20-30'),
  has_irregular_cycles: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ovulation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cycle_length + input.luteal_phase_length + input.last_period_start; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cycle_length + input.luteal_phase_length + input.last_period_start; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOvulation_calculator(input: Ovulation_calculatorInput): Ovulation_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Cycle variability control chart","Multi-cycle overlay"],
  };
}


export interface Ovulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
