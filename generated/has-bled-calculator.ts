// Auto-generated from has-bled-calculator-schema.json
import * as z from 'zod';

export interface Has_bled_calculatorInput {
  hypertension: number;
  abnormalRenal: number;
  abnormalLiver: number;
  stroke: number;
  bleeding: number;
  labileINR: number;
  elderly: number;
  drugsAlcohol: number;
  dataConfidence?: number;
}

export const Has_bled_calculatorInputSchema = z.object({
  hypertension: z.number().default(0),
  abnormalRenal: z.number().default(0),
  abnormalLiver: z.number().default(0),
  stroke: z.number().default(0),
  bleeding: z.number().default(0),
  labileINR: z.number().default(0),
  elderly: z.number().default(0),
  drugsAlcohol: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Has_bled_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hypertension * input.abnormalRenal * input.abnormalLiver * input.stroke; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.hypertension * input.abnormalRenal * input.abnormalLiver * input.stroke * (input.bleeding * input.labileINR * input.elderly * input.drugsAlcohol); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.bleeding * input.labileINR * input.elderly * input.drugsAlcohol; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHas_bled_calculator(input: Has_bled_calculatorInput): Has_bled_calculatorOutput {
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


export interface Has_bled_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
