// Auto-generated from atl-ctl-tsb-calculator-schema.json
import * as z from 'zod';

export interface Atl_ctl_tsb_calculatorInput {
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  nominal: number;
  dataConfidence?: number;
}

export const Atl_ctl_tsb_calculatorInputSchema = z.object({
  t1: z.number().default(0.1),
  t2: z.number().default(0.1),
  t3: z.number().default(0.1),
  t4: z.number().default(0.1),
  nominal: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atl_ctl_tsb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.t1 * input.t2 * input.t3 * input.t4; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.t1 * input.t2 * input.t3 * input.t4 * (input.nominal); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.nominal; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAtl_ctl_tsb_calculator(input: Atl_ctl_tsb_calculatorInput): Atl_ctl_tsb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Atl_ctl_tsb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
