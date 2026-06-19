// Auto-generated from piano-tuning-calculator-schema.json
import * as z from 'zod';

export interface Piano_tuning_calculatorInput {
  referenceMidi: number;
  referenceFreq: number;
  targetMidi: number;
  detuneCents: number;
  inharmonicityCoeff: number;
  dataConfidence?: number;
}

export const Piano_tuning_calculatorInputSchema = z.object({
  referenceMidi: z.number().default(69),
  referenceFreq: z.number().default(440),
  targetMidi: z.number().default(60),
  detuneCents: z.number().default(0),
  inharmonicityCoeff: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Piano_tuning_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.referenceMidi * input.referenceFreq * input.targetMidi * input.detuneCents; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.referenceMidi * input.referenceFreq * input.targetMidi * input.detuneCents * (input.inharmonicityCoeff); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.inharmonicityCoeff; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePiano_tuning_calculator(input: Piano_tuning_calculatorInput): Piano_tuning_calculatorOutput {
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


export interface Piano_tuning_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
