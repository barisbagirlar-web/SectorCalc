// Auto-generated from wells-score-calculator-schema.json
import * as z from 'zod';

export interface Wells_score_calculatorInput {
  activeCancer: number;
  paralysis: number;
  surgeryOrBedridden: number;
  tendernessAlongVeins: number;
  entireLegSwollen: number;
  calfSwellingOver3cm: number;
  pittingEdema: number;
  alternativeDiagnosis: number;
  dataConfidence?: number;
}

export const Wells_score_calculatorInputSchema = z.object({
  activeCancer: z.number().default(0),
  paralysis: z.number().default(0),
  surgeryOrBedridden: z.number().default(0),
  tendernessAlongVeins: z.number().default(0),
  entireLegSwollen: z.number().default(0),
  calfSwellingOver3cm: z.number().default(0),
  pittingEdema: z.number().default(0),
  alternativeDiagnosis: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wells_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.activeCancer * input.paralysis * input.surgeryOrBedridden * input.tendernessAlongVeins; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.activeCancer * input.paralysis * input.surgeryOrBedridden * input.tendernessAlongVeins * (input.entireLegSwollen * input.calfSwellingOver3cm * input.pittingEdema * input.alternativeDiagnosis); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.entireLegSwollen * input.calfSwellingOver3cm * input.pittingEdema * input.alternativeDiagnosis; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWells_score_calculator(input: Wells_score_calculatorInput): Wells_score_calculatorOutput {
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


export interface Wells_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
