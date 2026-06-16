// Auto-generated from lbtt-calculator-scotland-schema.json
import * as z from 'zod';

export interface Lbtt_calculator_scotlandInput {
  purchasePrice: number;
  isFirstTimeBuyer: number;
  isAdditionalDwelling: number;
}

export const Lbtt_calculator_scotlandInputSchema = z.object({
  purchasePrice: z.number().default(0),
  isFirstTimeBuyer: z.number().default(0),
  isAdditionalDwelling: z.number().default(0),
});

function evaluateAllFormulas(input: Lbtt_calculator_scotlandInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let p = input.purchasePrice; let tax = 0; if (p > 145000) { if (p > 250000) { tax += (Math.min(p, 325000) - 250000) * 0.05; } if (p > 325000) { tax += (Math.min(p, 750000) - 325000) * 0.10; } if (p > 750000) { tax += (p - 750000) * 0.12; } tax += (Math.min(p, 250000) - 145000) * 0.02; return } tax; })(); results["standardTax"] = Number.isFinite(v) ? v : 0; } catch { results["standardTax"] = 0; }
  try { const v = tax; results["firstTimeBuyerRelief"] = Number.isFinite(v) ? v : 0; } catch { results["firstTimeBuyerRelief"] = 0; }
  try { const v = (() => { let p = input.purchasePrice; let surcharge = 0; if (p <= 145000) { surcharge = p * 0.04; } else if (p <= 250000) { surcharge = 145000 * 0.04 + (p - 145000) * 0.06; } else if (p <= 325000) { surcharge = 145000 * 0.04 + (250000 - 145000) * 0.06 + (p - 250000) * 0.09; } else if (p <= 750000) { surcharge = 145000 * 0.04 + (250000 - 145000) * 0.06 + (325000 - 250000) * 0.09 + (p - 325000) * 0.14; } else { surcharge = 145000 * 0.04 + (250000 - 145000) * 0.06 + (325000 - 250000) * 0.09 + (750000 - 325000) * 0.14 + (p - 750000) * 0.16; return } surcharge; })(); results["adsSurcharge"] = Number.isFinite(v) ? v : 0; } catch { results["adsSurcharge"] = 0; }
  try { const v = base + ads; results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


export function calculateLbtt_calculator_scotland(input: Lbtt_calculator_scotlandInput): Lbtt_calculator_scotlandOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Lbtt_calculator_scotlandOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
