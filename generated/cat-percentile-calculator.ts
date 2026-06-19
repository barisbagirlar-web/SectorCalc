// Auto-generated from cat-percentile-calculator-schema.json
import * as z from 'zod';

export interface Cat_percentile_calculatorInput {
  overall_rank: number;
  total_candidates: number;
  qa_rank: number;
  qa_total: number;
  varc_rank: number;
  varc_total: number;
  lrdi_rank: number;
  lrdi_total: number;
  dataConfidence?: number;
}

export const Cat_percentile_calculatorInputSchema = z.object({
  overall_rank: z.number().default(1),
  total_candidates: z.number().default(200000),
  qa_rank: z.number().default(1),
  qa_total: z.number().default(200000),
  varc_rank: z.number().default(1),
  varc_total: z.number().default(200000),
  lrdi_rank: z.number().default(1),
  lrdi_total: z.number().default(200000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cat_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - (input.overall_rank / input.total_candidates)) * 100; results["overall_percentile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overall_percentile"] = 0; }
  try { const v = (1 - (input.qa_rank / input.qa_total)) * 100; results["qa_percentile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["qa_percentile"] = 0; }
  try { const v = (1 - (input.varc_rank / input.varc_total)) * 100; results["varc_percentile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["varc_percentile"] = 0; }
  try { const v = (1 - (input.lrdi_rank / input.lrdi_total)) * 100; results["lrdi_percentile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lrdi_percentile"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCat_percentile_calculator(input: Cat_percentile_calculatorInput): Cat_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lrdi_percentile"]);
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


export interface Cat_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
