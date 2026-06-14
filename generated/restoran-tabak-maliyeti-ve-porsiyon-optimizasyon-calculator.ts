// Auto-generated from restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInput {
  ingredientCostPerKg: number;
  portionWeight: number;
  laborCostPerHour: number;
  prepTimePerPortion: number;
  overheadRate: number;
  wastePercentage: number;
  desiredProfitMargin: number;
  dataConfidence: number;
}

export const RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputSchema = z.object({
  ingredientCostPerKg: z.number().min(0).default(50),
  portionWeight: z.number().min(0).default(250),
  laborCostPerHour: z.number().min(0).default(100),
  prepTimePerPortion: z.number().min(0).default(5),
  overheadRate: z.number().min(0).max(100).default(30),
  wastePercentage: z.number().min(0).max(100).default(5),
  desiredProfitMargin: z.number().min(0).max(100).default(20),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorOutput {
  sellingPrice: number;
  breakdown: {
    ingredientCostPerPortion: number;
    laborCostPerPortion: number;
    overheadCostPerPortion: number;
    totalCostPerPortion: number;
    costWithWaste: number;
    profitPerPortion: number;
    profitMarginActual: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.ingredientCostPerPortion = ((): number => { try { const __v = input.ingredientCostPerKg * input.portionWeight / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostPerPortion = ((): number => { try { const __v = input.laborCostPerHour * input.prepTimePerPortion / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPortion = ((): number => { try { const __v = results.ingredientCostPerPortion + results.laborCostPerPortion + (results.ingredientCostPerPortion + results.laborCostPerPortion) * input.overheadRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costWithWaste = ((): number => { try { const __v = results.totalCostPerPortion / (1 - input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sellingPrice = ((): number => { try { const __v = results.costWithWaste / (1 - input.desiredProfitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitPerPortion = ((): number => { try { const __v = results.sellingPrice - results.costWithWaste; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMarginActual = ((): number => { try { const __v = results.profitPerPortion / results.sellingPrice * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.sellingPrice * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(input: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInput): RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const sellingPrice = results.sellingPrice ?? 0;
  const breakdown = {
    ingredientCostPerPortion: results.ingredientCostPerPortion,
    laborCostPerPortion: results.laborCostPerPortion,
    overheadCostPerPortion: results.overheadCostPerPortion,
    totalCostPerPortion: results.totalCostPerPortion,
    costWithWaste: results.costWithWaste,
    profitPerPortion: results.profitPerPortion,
    profitMarginActual: results.profitMarginActual,
  };

  // rule: ingredientCostPerKg > 0
  // rule: portionWeight > 0
  // rule: laborCostPerHour > 0
  // rule: prepTimePerPortion > 0
  // rule: overheadRate >= 0
  // rule: wastePercentage >= 0
  // rule: desiredProfitMargin >= 0
  // rule: dataConfidence between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek fire orani, maliyetleri artiriyor. Surec iyilestirme onerilir.
  // threshold skipped (non-JS): Hedef kar marji cok yuksek, pazar kosullarini kontrol edin.
  // threshold skipped (non-JS): Genel giderler cok yuksek, maliyet dusurme aksiyonu alinmali.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return sellingPrice; } })();

  return {
    sellingPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirmali senaryo analizi","Detayli maliyet raporu"],
  };
}
