// Auto-generated from preterm-birth-risk-calculator-schema.json
import * as z from 'zod';

export interface Preterm_birth_risk_calculatorInput {
  age: number;
  cervicalLength: number;
  fetalFibronectin: number;
  previousPreterm: number;
}

export const Preterm_birth_risk_calculatorInputSchema = z.object({
  age: z.number().default(30),
  cervicalLength: z.number().default(35),
  fetalFibronectin: z.number().default(20),
  previousPreterm: z.number().default(0),
});

function evaluateAllFormulas(input: Preterm_birth_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -3 + 0.1*input.age - 0.1*input.cervicalLength + 0.01*input.fetalFibronectin + 1.5*input.previousPreterm; results["linearCombo"] = Number.isFinite(v) ? v : 0; } catch { results["linearCombo"] = 0; }
  try { const v = 1 / (1 + Math.exp(-(results["linearCombo"] ?? 0))); results["riskProbability"] = Number.isFinite(v) ? v : 0; } catch { results["riskProbability"] = 0; }
  try { const v = (results["riskProbability"] ?? 0) * 100; results["riskPercent"] = Number.isFinite(v) ? v : 0; } catch { results["riskPercent"] = 0; }
  return results;
}


export function calculatePreterm_birth_risk_calculator(input: Preterm_birth_risk_calculatorInput): Preterm_birth_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskPercent"] ?? 0;
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


export interface Preterm_birth_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
