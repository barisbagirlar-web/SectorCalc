// Auto-generated from internet-cost-calculator-schema.json
import * as z from 'zod';

export interface Internet_cost_calculatorInput {
  monthlyBaseFee: number;
  dataCap: number;
  overageRate: number;
  usage: number;
  discountPercent: number;
  taxRate: number;
}

export const Internet_cost_calculatorInputSchema = z.object({
  monthlyBaseFee: z.number().default(50),
  dataCap: z.number().default(100),
  overageRate: z.number().default(2),
  usage: z.number().default(120),
  discountPercent: z.number().default(10),
  taxRate: z.number().default(18),
});

function evaluateAllFormulas(input: Internet_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyBaseFee; results["temelUcret"] = Number.isFinite(v) ? v : 0; } catch { results["temelUcret"] = 0; }
  try { const v = Math.max(0, input.usage - input.dataCap) * input.overageRate; results["kotaAsimUcreti"] = Number.isFinite(v) ? v : 0; } catch { results["kotaAsimUcreti"] = 0; }
  try { const v = (results["temelUcret"] ?? 0) + (results["kotaAsimUcreti"] ?? 0); results["araToplam"] = Number.isFinite(v) ? v : 0; } catch { results["araToplam"] = 0; }
  try { const v = (results["araToplam"] ?? 0) * (input.discountPercent / 100); results["indirimTutari"] = Number.isFinite(v) ? v : 0; } catch { results["indirimTutari"] = 0; }
  try { const v = (results["araToplam"] ?? 0) - (results["indirimTutari"] ?? 0); results["indirimliToplam"] = Number.isFinite(v) ? v : 0; } catch { results["indirimliToplam"] = 0; }
  try { const v = (results["indirimliToplam"] ?? 0) * (input.taxRate / 100); results["vergiTutari"] = Number.isFinite(v) ? v : 0; } catch { results["vergiTutari"] = 0; }
  try { const v = (results["indirimliToplam"] ?? 0) + (results["vergiTutari"] ?? 0); results["toplamAylik"] = Number.isFinite(v) ? v : 0; } catch { results["toplamAylik"] = 0; }
  return results;
}


export function calculateInternet_cost_calculator(input: Internet_cost_calculatorInput): Internet_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["toplamAylik"] ?? 0;
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


export interface Internet_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
