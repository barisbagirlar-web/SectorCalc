// Auto-generated from xirr-calculator-schema.json
import * as z from 'zod';

export interface Xirr_calculatorInput {
  initialInvestment: number;
  initialDate: number;
  cf1Amount: number;
  cf1Days: number;
  cf2Amount: number;
  cf2Days: number;
  finalValue: number;
  finalDays: number;
}

export const Xirr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-10000),
  initialDate: z.number().default(0),
  cf1Amount: z.number().default(0),
  cf1Days: z.number().default(0),
  cf2Amount: z.number().default(0),
  cf2Days: z.number().default(0),
  finalValue: z.number().default(11000),
  finalDays: z.number().default(365),
});

function evaluateAllFormulas(input: Xirr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(r) { var c=[initialInvestment,cf1Amount,cf2Amount,finalValue],d=[initialDate,cf1Days,cf2Days,finalDays],d0=d[0],n=0;for(var i=0;i<c.length;i++){n+=c[i]/Math.pow(1+r,(d[i]-d0)/365);}return n; })(r); results["npv"] = Number.isFinite(v) ? v : 0; } catch { results["npv"] = 0; }
  results["xirr"] = 0;
  return results;
}


export function calculateXirr_calculator(input: Xirr_calculatorInput): Xirr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["xirr"] ?? 0;
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


export interface Xirr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
