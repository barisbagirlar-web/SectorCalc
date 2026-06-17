// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beneish_m_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = -4.84 + 0.92 * input.dsri + 0.528 * input.gmi + 0.404 * input.aqi + 0.892 * input.sgi + 0.115 * input.depi - 0.172 * input.sgai - 0.327 * input.lvgi + 4.679 * input.tata; results["mScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mScore"] = 0; }
  try { const v = -2.22; results["threshold"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["threshold"] = 0; }
  try { const v = (asFormulaNumber(results["mScore"])) > (asFormulaNumber(results["threshold"])) ? 1 : 0; results["manipulationIndicator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["manipulationIndicator"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBeneish_m_score_calculator(input: Beneish_m_score_calculatorInput): Beneish_m_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
