// Auto-generated from vdot-calculator-schema.json
import * as z from 'zod';

export interface Vdot_calculatorInput {
  frekans: number;
  genlik: number;
  sonumleme: number;
  malzemeFaktoru: number;
  guvenlikFaktoru: number;
}

export const Vdot_calculatorInputSchema = z.object({
  frekans: z.number().default(50),
  genlik: z.number().default(0.5),
  sonumleme: z.number().default(0.05),
  malzemeFaktoru: z.number().default(210),
  guvenlikFaktoru: z.number().default(1.5),
});

function evaluateAllFormulas(input: Vdot_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * Math.PI * input.frekans * input.genlik) / (input.sonumleme * input.malzemeFaktoru * input.guvenlikFaktoru); results["vdot"] = Number.isFinite(v) ? v : 0; } catch { results["vdot"] = 0; }
  try { const v = 10; results["limit"] = Number.isFinite(v) ? v : 0; } catch { results["limit"] = 0; }
  try { const v = (results["vdot"] ?? 0) <= (results["limit"] ?? 0) ? 'Evet' : 'Hayır'; results["acceptable"] = Number.isFinite(v) ? v : 0; } catch { results["acceptable"] = 0; }
  results["__frekans__Hz__Genlik____genlik__mm__S_n"] = 0;
  results["__vdot_toFixed_4___mm_s__Limit____limit_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateVdot_calculator(input: Vdot_calculatorInput): Vdot_calculatorOutput {
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


export interface Vdot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
