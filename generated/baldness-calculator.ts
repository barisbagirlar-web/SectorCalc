// Auto-generated from baldness-calculator-schema.json
import * as z from 'zod';

export interface Baldness_calculatorInput {
  age: number;
  father_baldness: number;
  stress_level: number;
  dht_level: number;
  hair_density: number;
}

export const Baldness_calculatorInputSchema = z.object({
  age: z.number().default(30),
  father_baldness: z.number().default(0.5),
  stress_level: z.number().default(5),
  dht_level: z.number().default(50),
  hair_density: z.number().default(200),
});

function evaluateAllFormulas(input: Baldness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.father_baldness * 0.6; results["genetic_factor"] = Number.isFinite(v) ? v : 0; } catch { results["genetic_factor"] = 0; }
  try { const v = 1 - Math.exp(-input.stress_level / 5); results["stress_impact"] = Number.isFinite(v) ? v : 0; } catch { results["stress_impact"] = 0; }
  try { const v = 1 / (1 + Math.exp(-(input.age - 40) / 5)); results["age_factor"] = Number.isFinite(v) ? v : 0; } catch { results["age_factor"] = 0; }
  try { const v = Math.min(input.dht_level / 100, 1); results["dht_factor"] = Number.isFinite(v) ? v : 0; } catch { results["dht_factor"] = 0; }
  try { const v = Math.max(0, 1 - (input.hair_density / 300)); results["density_factor"] = Number.isFinite(v) ? v : 0; } catch { results["density_factor"] = 0; }
  try { const v = (results["age_factor"] ?? 0) * 0.3 + (results["genetic_factor"] ?? 0) * 0.3 + (results["stress_impact"] ?? 0) * 0.2 + (results["dht_factor"] ?? 0) * 0.1 + (results["density_factor"] ?? 0) * 0.1; results["baldness_probability_raw"] = Number.isFinite(v) ? v : 0; } catch { results["baldness_probability_raw"] = 0; }
  try { const v = Math.round(Math.min((results["baldness_probability_raw"] ?? 0), 1) * 100); results["baldness_probability"] = Number.isFinite(v) ? v : 0; } catch { results["baldness_probability"] = 0; }
  return results;
}


export function calculateBaldness_calculator(input: Baldness_calculatorInput): Baldness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["baldness_probability"] ?? 0;
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


export interface Baldness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
