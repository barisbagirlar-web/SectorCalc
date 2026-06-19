// Auto-generated from irr-calculator-schema.json
import * as z from 'zod';

export interface Irr_calculatorInput {
  initialInvestment: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  guess: number;
  dataConfidence?: number;
}

export const Irr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-1000),
  year1: z.number().default(300),
  year2: z.number().default(400),
  year3: z.number().default(500),
  year4: z.number().default(500),
  year5: z.number().default(400),
  guess: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Irr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment * input.year1 * input.year2 * input.year3; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.initialInvestment * input.year1 * input.year2 * input.year3 * (input.year4 * input.year5 * (input.guess / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.year4 * input.year5 * (input.guess / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIrr_calculator(input: Irr_calculatorInput): Irr_calculatorOutput {
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


export interface Irr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
