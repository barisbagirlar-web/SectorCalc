// Auto-generated from biodiversity-calculator-schema.json
import * as z from 'zod';

export interface Biodiversity_calculatorInput {
  sp1: number;
  sp2: number;
  sp3: number;
  sp4: number;
  sp5: number;
  dataConfidence?: number;
}

export const Biodiversity_calculatorInputSchema = z.object({
  sp1: z.number().default(0),
  sp2: z.number().default(0),
  sp3: z.number().default(0),
  sp4: z.number().default(0),
  sp5: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Biodiversity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.sp1>0?1:0)+(input.sp2>0?1:0)+(input.sp3>0?1:0)+(input.sp4>0?1:0)+(input.sp5>0?1:0)); results["speciesRichness"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speciesRichness"] = Number.NaN; }
  try { const v = ((input.sp1>0?1:0)+(input.sp2>0?1:0)+(input.sp3>0?1:0)+(input.sp4>0?1:0)+(input.sp5>0?1:0)); results["speciesRichness_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speciesRichness_aux"] = Number.NaN; }
  return results;
}


export function calculateBiodiversity_calculator(input: Biodiversity_calculatorInput): Biodiversity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speciesRichness_aux"]);
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


export interface Biodiversity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
