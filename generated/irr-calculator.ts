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

function evaluateAllFormulas(input: Irr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(){var c=[initialInvestment,year1,year2,year3,year4,year5];var r=guess/100;var tol=1e-7;var max=1000;for(var i=0;i<max;i++){var npv=0;for(var t=0;t<c.length;t++){npv+=c[t]/Math.pow(1+r,t);}if(Math.abs(npv)<tol)break;var d=0;for(var t=1;t<c.length;t++){d+=-t*c[t]/Math.pow(1+r,t+1);}r-=npv/d;}return r*100;})(); results["irr"] = Number.isFinite(v) ? v : 0; } catch { results["irr"] = 0; }
  try { const v = (function(){var c=[initialInvestment,year1,year2,year3,year4,year5];var r=guess/100;var tol=1e-7;var max=1000;for(var i=0;i<max;i++){var npv=0;for(var t=0;t<c.length;t++){npv+=c[t]/Math.pow(1+r,t);}if(Math.abs(npv)<tol)break;var d=0;for(var t=1;t<c.length;t++){d+=-t*c[t]/Math.pow(1+r,t+1);}r-=npv/d;}var npvFinal=0;for(var t=0;t<c.length;t++){npvFinal+=c[t]/Math.pow(1+r,t);}return npvFinal;})(); results["npvAtIrr"] = Number.isFinite(v) ? v : 0; } catch { results["npvAtIrr"] = 0; }
  return results;
}


export function calculateIrr_calculator(input: Irr_calculatorInput): Irr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["irr"] ?? 0;
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


export interface Irr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
