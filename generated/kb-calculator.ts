// Auto-generated from kb-calculator-schema.json
import * as z from 'zod';

export interface Kb_calculatorInput {
  wireDia: number;
  coilDia: number;
  activeCoils: number;
  shearModulus: number;
}

export const Kb_calculatorInputSchema = z.object({
  wireDia: z.number().default(1),
  coilDia: z.number().default(10),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(80000),
});

function evaluateAllFormulas(input: Kb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.shearModulus * Math.pow(input.wireDia, 4)) / (8 * Math.pow(input.coilDia, 3) * input.activeCoils); results["k"] = Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  results["Tel__ap_n_n_4__kuvveti"] = 0;
  results["Sar_m__ap_n_n_3__kuvveti"] = 0;
  results["Payda__arp_m_"] = 0;
  return results;
}


export function calculateKb_calculator(input: Kb_calculatorInput): Kb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["k"] ?? 0;
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


export interface Kb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
