// Auto-generated from solar-roi-calculator-schema.json
import * as z from 'zod';

export interface Solar_roi_calculatorInput {
  systemCost: number;
  yillikUretim: number;
  elektrikFiyati: number;
  sistemOmru: number;
  tesvikOrani: number;
}

export const Solar_roi_calculatorInputSchema = z.object({
  systemCost: z.number().default(50000),
  yillikUretim: z.number().default(5000),
  elektrikFiyati: z.number().default(1.2),
  sistemOmru: z.number().default(25),
  tesvikOrani: z.number().default(20),
});

function evaluateAllFormulas(input: Solar_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.systemCost * (1 - input.tesvikOrani / 100); results["netMaliyet"] = Number.isFinite(v) ? v : 0; } catch { results["netMaliyet"] = 0; }
  try { const v = input.yillikUretim * input.elektrikFiyati; results["yillikTasarruf"] = Number.isFinite(v) ? v : 0; } catch { results["yillikTasarruf"] = 0; }
  try { const v = (results["yillikTasarruf"] ?? 0) * input.sistemOmru; results["toplamTasarruf"] = Number.isFinite(v) ? v : 0; } catch { results["toplamTasarruf"] = 0; }
  try { const v = (results["toplamTasarruf"] ?? 0) - (results["netMaliyet"] ?? 0); results["netKar"] = Number.isFinite(v) ? v : 0; } catch { results["netKar"] = 0; }
  try { const v = (results["netMaliyet"] ?? 0) / (results["yillikTasarruf"] ?? 0); results["geriOdemeSuresi"] = Number.isFinite(v) ? v : 0; } catch { results["geriOdemeSuresi"] = 0; }
  try { const v = ((results["netKar"] ?? 0) / (results["netMaliyet"] ?? 0)) * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateSolar_roi_calculator(input: Solar_roi_calculatorInput): Solar_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roi"] ?? 0;
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


export interface Solar_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
