// Auto-generated from brayton-cycle-calculator-schema.json
import * as z from 'zod';

export interface Brayton_cycle_calculatorInput {
  T1: number;
  T3: number;
  rp: number;
  eta_c: number;
  eta_t: number;
  gamma: number;
  cp: number;
  dataConfidence?: number;
}

export const Brayton_cycle_calculatorInputSchema = z.object({
  T1: z.number().default(300),
  T3: z.number().default(1200),
  rp: z.number().default(10),
  eta_c: z.number().default(0.85),
  eta_t: z.number().default(0.9),
  gamma: z.number().default(1.4),
  cp: z.number().default(1.005),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brayton_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.T1 * input.T3 * input.rp * input.eta_c; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.T1 * input.T3 * input.rp * input.eta_c * (input.eta_t * input.gamma * input.cp); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.eta_t * input.gamma * input.cp; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBrayton_cycle_calculator(input: Brayton_cycle_calculatorInput): Brayton_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Brayton_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
