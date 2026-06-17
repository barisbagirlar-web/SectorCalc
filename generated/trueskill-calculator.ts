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

function evaluateAllFormulas(input: Trueskill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(2 * input.beta * input.beta + input.sigma_winner * input.sigma_winner + input.sigma_loser * input.sigma_loser); results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = input.mu_winner + (input.sigma_winner * input.sigma_winner / (results["c"] ?? 0)) * (Math.exp(-((input.mu_winner - input.mu_loser) * (input.mu_winner - input.mu_loser)) / (2 * (results["c"] ?? 0) * (results["c"] ?? 0))) / (1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0))))); results["mu_winner_new"] = Number.isFinite(v) ? v : 0; } catch { results["mu_winner_new"] = 0; }
  try { const v = Math.sqrt(input.sigma_winner * input.sigma_winner * (1 - (input.sigma_winner * input.sigma_winner / ((results["c"] ?? 0) * (results["c"] ?? 0))) * (Math.exp(-((input.mu_winner - input.mu_loser) * (input.mu_winner - input.mu_loser)) / (2 * (results["c"] ?? 0) * (results["c"] ?? 0))) * (1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0)))) / ((1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0)))) * (1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0)))))))); results["sigma_winner_new"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_winner_new"] = 0; }
  try { const v = input.mu_loser - (input.sigma_loser * input.sigma_loser / (results["c"] ?? 0)) * (Math.exp(-((input.mu_winner - input.mu_loser) * (input.mu_winner - input.mu_loser)) / (2 * (results["c"] ?? 0) * (results["c"] ?? 0))) / (1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0))))); results["mu_loser_new"] = Number.isFinite(v) ? v : 0; } catch { results["mu_loser_new"] = 0; }
  try { const v = Math.sqrt(input.sigma_loser * input.sigma_loser * (1 - (input.sigma_loser * input.sigma_loser / ((results["c"] ?? 0) * (results["c"] ?? 0))) * (Math.exp(-((input.mu_winner - input.mu_loser) * (input.mu_winner - input.mu_loser)) / (2 * (results["c"] ?? 0) * (results["c"] ?? 0))) * (1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0)))) / ((1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0)))) * (1 + Math.exp(-((input.mu_winner - input.mu_loser) / (results["c"] ?? 0)))))))); results["sigma_loser_new"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_loser_new"] = 0; }
  try { const v = (results["mu_winner_new"] ?? 0) + input.tau * input.tau; results["mu_winner_new_with_dynamics"] = Number.isFinite(v) ? v : 0; } catch { results["mu_winner_new_with_dynamics"] = 0; }
  try { const v = Math.sqrt((results["sigma_winner_new"] ?? 0) * (results["sigma_winner_new"] ?? 0) + input.tau * input.tau); results["sigma_winner_new_with_dynamics"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_winner_new_with_dynamics"] = 0; }
  try { const v = (results["mu_loser_new"] ?? 0) + input.tau * input.tau; results["mu_loser_new_with_dynamics"] = Number.isFinite(v) ? v : 0; } catch { results["mu_loser_new_with_dynamics"] = 0; }
  try { const v = Math.sqrt((results["sigma_loser_new"] ?? 0) * (results["sigma_loser_new"] ?? 0) + input.tau * input.tau); results["sigma_loser_new_with_dynamics"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_loser_new_with_dynamics"] = 0; }
  try { const v = (results["sigma_winner_new_with_dynamics"] ?? 0); results["_sigma_winner_new_with_dynamics_"] = Number.isFinite(v) ? v : 0; } catch { results["_sigma_winner_new_with_dynamics_"] = 0; }
  try { const v = (results["mu_loser_new_with_dynamics"] ?? 0); results["_mu_loser_new_with_dynamics_"] = Number.isFinite(v) ? v : 0; } catch { results["_mu_loser_new_with_dynamics_"] = 0; }
  try { const v = (results["sigma_loser_new_with_dynamics"] ?? 0); results["_sigma_loser_new_with_dynamics_"] = Number.isFinite(v) ? v : 0; } catch { results["_sigma_loser_new_with_dynamics_"] = 0; }
  results["result"] = 0;
  return results;
}


export function calculateTrueskill_calculator(input: Trueskill_calculatorInput): Trueskill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
