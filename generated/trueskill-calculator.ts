// @ts-nocheck
// Auto-generated from trueskill-calculator-schema.json
import * as z from 'zod';

export interface Trueskill_calculatorInput {
  mu_winner: number;
  sigma_winner: number;
  mu_loser: number;
  sigma_loser: number;
  beta: number;
  tau: number;
  draw_probability: number;
}

export const Trueskill_calculatorInputSchema = z.object({
  mu_winner: z.number().default(25),
  sigma_winner: z.number().default(8.333),
  mu_loser: z.number().default(25),
  sigma_loser: z.number().default(8.333),
  beta: z.number().default(4.1667),
  tau: z.number().default(0.08333),
  draw_probability: z.number().default(0.1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trueskill_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.mu_winner * input.sigma_winner * input.mu_loser * input.sigma_loser; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.mu_winner * input.sigma_winner * input.mu_loser * input.sigma_loser * (input.beta * input.tau * input.draw_probability); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.beta * input.tau * input.draw_probability; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTrueskill_calculator(input: Trueskill_calculatorInput): Trueskill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Trueskill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
