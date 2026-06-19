// Auto-generated from baldness-calculator-schema.json
import * as z from 'zod';

export interface Baldness_calculatorInput {
  age: number;
  father_baldness: number;
  stress_level: number;
  dht_level: number;
  hair_density: number;
  dataConfidence?: number;
}

export const Baldness_calculatorInputSchema = z.object({
  age: z.number().default(30),
  father_baldness: z.number().default(0.5),
  stress_level: z.number().default(5),
  dht_level: z.number().default(50),
  hair_density: z.number().default(200),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baldness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.father_baldness * 0.6; results["genetic_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["genetic_factor"] = 0; }
  try { const v = input.stress_level * 0.05; results["stress_impact"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stress_impact"] = 0; }
  try { const v = input.age * 0.01; results["age_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["age_factor"] = 0; }
  try { const v = input.dht_level * 0.002; results["dht_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dht_factor"] = 0; }
  try { const v = input.hair_density * 0.001; results["density_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["density_factor"] = 0; }
  try { const v = (asFormulaNumber(results["genetic_factor"])) + (asFormulaNumber(results["stress_impact"])) + (asFormulaNumber(results["age_factor"])) + (asFormulaNumber(results["dht_factor"])) - (asFormulaNumber(results["density_factor"])); results["baldness_probability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baldness_probability"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaldness_calculator(input: Baldness_calculatorInput): Baldness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["baldness_probability"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Baldness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
