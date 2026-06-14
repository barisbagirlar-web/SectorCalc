// Auto-generated from kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInput {
  directCost: number;
  indirectCostFactor: number;
  lostWorkDays: number;
  dailyWage: number;
  numAffectedEmployees: number;
  productivityLossPercent: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputSchema = z.object({
  directCost: z.number().min(0).default(0),
  indirectCostFactor: z.number().min(1).max(20).default(4),
  lostWorkDays: z.number().min(0).default(0),
  dailyWage: z.number().min(0).default(200),
  numAffectedEmployees: z.number().min(1).default(1),
  productivityLossPercent: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorOutput {
  totalCost: number;
  breakdown: {
    directCostTotal: number;
    indirectCost: number;
    laborCostLoss: number;
    productivityLoss: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directCostTotal = ((): number => { try { const __v = input.directCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.indirectCost = ((): number => { try { const __v = input.directCost * input.indirectCostFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostLoss = ((): number => { try { const __v = input.lostWorkDays * input.dailyWage * input.numAffectedEmployees; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.productivityLoss = ((): number => { try { const __v = input.numAffectedEmployees * input.dailyWage * 30 * (input.productivityLossPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.directCostTotal + results.indirectCost + results.laborCostLoss + results.productivityLoss; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.totalCost * 1.2 : input.dataConfidence === 'medium' ? results.totalCost * 1.1 : results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(input: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInput): KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    directCostTotal: results.directCostTotal,
    indirectCost: results.indirectCost,
    laborCostLoss: results.laborCostLoss,
    productivityLoss: results.productivityLoss,
  };

  // rule: directCost >= 0
  // rule: indirectCostFactor >= 1 && indirectCostFactor <= 20
  // rule: lostWorkDays >= 0
  // rule: dailyWage >= 0
  // rule: numAffectedEmployees >= 1
  // rule: productivityLossPercent >= 0 && productivityLossPercent <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek dogrudan maliyet, detayli inceleme onerilir.
  // threshold skipped (non-JS): Uzun sureli is gucu kaybi, rehabilitasyon plani gerekebilir.
  // threshold skipped (non-JS): Ciddi verimlilik kaybi, acil mudahale gerekiyor.

  const dataConfidenceAdjusted = (() => { try { return input.dataConfidence === 'low' ? results.totalCost * 1.2 : input.dataConfidence === 'medium' ? results.totalCost * 1.1 : results.totalCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (benchmark)","Detayli rapor"],
  };
}
