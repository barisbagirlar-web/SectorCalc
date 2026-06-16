// Auto-generated from beneish-m-score-calculator-schema.json
import * as z from 'zod';

export interface Beneish_m_score_calculatorInput {
  dsri: number;
  gmi: number;
  aqi: number;
  sgi: number;
  depi: number;
  sgai: number;
  lvgi: number;
  tata: number;
}

export const Beneish_m_score_calculatorInputSchema = z.object({
  dsri: z.number().default(1),
  gmi: z.number().default(1),
  aqi: z.number().default(1),
  sgi: z.number().default(1),
  depi: z.number().default(1),
  sgai: z.number().default(1),
  lvgi: z.number().default(1),
  tata: z.number().default(0),
});

function evaluateAllFormulas(input: Beneish_m_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -4.84 + 0.92 * input.dsri + 0.528 * input.gmi + 0.404 * input.aqi + 0.892 * input.sgi + 0.115 * input.depi - 0.172 * input.sgai - 0.327 * input.lvgi + 4.679 * input.tata; results["mScore"] = Number.isFinite(v) ? v : 0; } catch { results["mScore"] = 0; }
  try { const v = -2.22; results["threshold"] = Number.isFinite(v) ? v : 0; } catch { results["threshold"] = 0; }
  try { const v = (results["mScore"] ?? 0) > (results["threshold"] ?? 0) ? 1 : 0; results["manipulationIndicator"] = Number.isFinite(v) ? v : 0; } catch { results["manipulationIndicator"] = 0; }
  return results;
}


export function calculateBeneish_m_score_calculator(input: Beneish_m_score_calculatorInput): Beneish_m_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mScore"] ?? 0;
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


export interface Beneish_m_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
