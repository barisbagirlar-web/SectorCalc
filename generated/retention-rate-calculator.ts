// Auto-generated from retention-rate-calculator-schema.json
import * as z from 'zod';

export interface Retention_rate_calculatorInput {
  customersStart: number;
  customersEnd: number;
  newCustomers: number;
  periodDays: number;
  dataConfidence?: number;
}

export const Retention_rate_calculatorInputSchema = z.object({
  customersStart: z.number().default(1000),
  customersEnd: z.number().default(900),
  newCustomers: z.number().default(200),
  periodDays: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Retention_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.customersEnd - input.newCustomers; results["retainedCustomers"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["retainedCustomers"] = 0; }
  try { const v = input.customersStart > 0 ? ((input.customersEnd - input.newCustomers) / input.customersStart) * 100 : 0; results["retentionRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["retentionRate"] = 0; }
  try { const v = input.customersStart > 0 ? 100 - ((input.customersEnd - input.newCustomers) / input.customersStart) * 100 : 0; results["churnRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["churnRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRetention_rate_calculator(input: Retention_rate_calculatorInput): Retention_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["retentionRate"]));
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


export interface Retention_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
