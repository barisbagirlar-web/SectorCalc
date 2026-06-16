// Auto-generated from biodiversity-calculator-schema.json
import * as z from 'zod';

export interface Biodiversity_calculatorInput {
  sp1: number;
  sp2: number;
  sp3: number;
  sp4: number;
  sp5: number;
}

export const Biodiversity_calculatorInputSchema = z.object({
  sp1: z.number().default(0),
  sp2: z.number().default(0),
  sp3: z.number().default(0),
  sp4: z.number().default(0),
  sp5: z.number().default(0),
});

function evaluateAllFormulas(input: Biodiversity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.sp1>0?1:0)+(input.sp2>0?1:0)+(input.sp3>0?1:0)+(input.sp4>0?1:0)+(input.sp5>0?1:0)); results["speciesRichness"] = Number.isFinite(v) ? v : 0; } catch { results["speciesRichness"] = 0; }
  try { const v = t===0?0:-((input.sp1>0?(input.sp1/t)*Math.log(input.sp1/t):0)+(input.sp2>0?(input.sp2/t)*Math.log(input.sp2/t):0)+(input.sp3>0?(input.sp3/t)*Math.log(input.sp3/t):0)+(input.sp4>0?(input.sp4/t)*Math.log(input.sp4/t):0)+(input.sp5>0?(input.sp5/t)*Math.log(input.sp5/t):0)); results["shannonDiversity"] = Number.isFinite(v) ? v : 0; } catch { results["shannonDiversity"] = 0; }
  try { const v = t<2?0:1-s/(t*(t-1)); results["simpsonDiversity"] = Number.isFinite(v) ? v : 0; } catch { results["simpsonDiversity"] = 0; }
  return results;
}


export function calculateBiodiversity_calculator(input: Biodiversity_calculatorInput): Biodiversity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shannonDiversity"] ?? 0;
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


export interface Biodiversity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
