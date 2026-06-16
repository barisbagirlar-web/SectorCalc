// Auto-generated from dcf-calculator-schema.json
import * as z from 'zod';

export interface Dcf_calculatorInput {
  cf1: number;
  cf2: number;
  cf3: number;
  cf4: number;
  cf5: number;
  discountRate: number;
  growthRate: number;
}

export const Dcf_calculatorInputSchema = z.object({
  cf1: z.number().default(0),
  cf2: z.number().default(0),
  cf3: z.number().default(0),
  cf4: z.number().default(0),
  cf5: z.number().default(0),
  discountRate: z.number().default(10),
  growthRate: z.number().default(2),
});

function evaluateAllFormulas(input: Dcf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100; results["discount"] = Number.isFinite(v) ? v : 0; } catch { results["discount"] = 0; }
  try { const v = input.growthRate / 100; results["growth"] = Number.isFinite(v) ? v : 0; } catch { results["growth"] = 0; }
  try { const v = input.cf1 / ((1 + (results["discount"] ?? 0)) ** 1); results["pvYear1"] = Number.isFinite(v) ? v : 0; } catch { results["pvYear1"] = 0; }
  try { const v = input.cf2 / ((1 + (results["discount"] ?? 0)) ** 2); results["pvYear2"] = Number.isFinite(v) ? v : 0; } catch { results["pvYear2"] = 0; }
  try { const v = input.cf3 / ((1 + (results["discount"] ?? 0)) ** 3); results["pvYear3"] = Number.isFinite(v) ? v : 0; } catch { results["pvYear3"] = 0; }
  try { const v = input.cf4 / ((1 + (results["discount"] ?? 0)) ** 4); results["pvYear4"] = Number.isFinite(v) ? v : 0; } catch { results["pvYear4"] = 0; }
  try { const v = input.cf5 / ((1 + (results["discount"] ?? 0)) ** 5); results["pvYear5"] = Number.isFinite(v) ? v : 0; } catch { results["pvYear5"] = 0; }
  try { const v = (input.cf5 * (1 + (results["growth"] ?? 0))) / ((results["discount"] ?? 0) - (results["growth"] ?? 0)); results["terminalValue"] = Number.isFinite(v) ? v : 0; } catch { results["terminalValue"] = 0; }
  try { const v = (results["terminalValue"] ?? 0) / ((1 + (results["discount"] ?? 0)) ** 5); results["terminalValuePV"] = Number.isFinite(v) ? v : 0; } catch { results["terminalValuePV"] = 0; }
  try { const v = (results["pvYear1"] ?? 0) + (results["pvYear2"] ?? 0) + (results["pvYear3"] ?? 0) + (results["pvYear4"] ?? 0) + (results["pvYear5"] ?? 0) + (results["terminalValuePV"] ?? 0); results["dcfValue"] = Number.isFinite(v) ? v : 0; } catch { results["dcfValue"] = 0; }
  return results;
}


export function calculateDcf_calculator(input: Dcf_calculatorInput): Dcf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dcfValue"] ?? 0;
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


export interface Dcf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
