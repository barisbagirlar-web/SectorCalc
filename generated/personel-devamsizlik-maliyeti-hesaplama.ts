// Auto-generated from personel-devamsizlik-maliyeti-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PersonelDevamsizlikMaliyetiHesaplamaInput {
  totalEmployees: number;
  absenceRate: number;
  averageDailyWage: number;
  workingDaysPerYear: number;
  overtimeCostMultiplier: number;
  replacementCostPerDay: number;
  productivityLossPercent: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PersonelDevamsizlikMaliyetiHesaplamaInputSchema = z.object({
  totalEmployees: z.number().min(1).max(100000).default(100),
  absenceRate: z.number().min(0).max(100).default(5),
  averageDailyWage: z.number().min(0).max(10000).default(300),
  workingDaysPerYear: z.number().min(1).max(365).default(260),
  overtimeCostMultiplier: z.number().min(1).max(3).default(1.5),
  replacementCostPerDay: z.number().min(0).max(10000).default(200),
  productivityLossPercent: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PersonelDevamsizlikMaliyetiHesaplamaOutput {
  totalCost: number;
  breakdown: {
    directWageCost: number;
    replacementCost: number;
    overtimeCost: number;
    productivityLossCost: number;
    costPerEmployee: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PersonelDevamsizlikMaliyetiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAbsenceDays = ((): number => { try { const __v = input.totalEmployees * (input.absenceRate / 100) * input.workingDaysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directWageCost = ((): number => { try { const __v = results.totalAbsenceDays * input.averageDailyWage; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.replacementCost = ((): number => { try { const __v = results.totalAbsenceDays * input.replacementCostPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overtimeCost = ((): number => { try { const __v = results.totalAbsenceDays * input.averageDailyWage * (input.overtimeCostMultiplier - 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.productivityLossCost = ((): number => { try { const __v = results.totalAbsenceDays * input.averageDailyWage * (input.productivityLossPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.directWageCost + results.replacementCost + results.overtimeCost + results.productivityLossCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerEmployee = ((): number => { try { const __v = results.totalCost / input.totalEmployees; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.totalCost * 1.2 : input.dataConfidence == 'medium' ? results.totalCost * 1.0 : results.totalCost * 0.9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePersonelDevamsizlikMaliyetiHesaplama(input: PersonelDevamsizlikMaliyetiHesaplamaInput): PersonelDevamsizlikMaliyetiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    directWageCost: results.directWageCost,
    replacementCost: results.replacementCost,
    overtimeCost: results.overtimeCost,
    productivityLossCost: results.productivityLossCost,
    costPerEmployee: results.costPerEmployee,
  };

  // rule: absenceRate >= 0 AND absenceRate <= 100
  // rule: averageDailyWage > 0
  // rule: workingDaysPerYear >= 1 AND workingDaysPerYear <= 365
  // rule: overtimeCostMultiplier >= 1 AND overtimeCostMultiplier <= 3
  // rule: replacementCostPerDay >= 0
  // rule: productivityLossPercent >= 0 AND productivityLossPercent <= 100
  // rule: totalEmployees >= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.absenceRate > 10) hiddenLossDrivers.push("Kritik: Devamsizlik orani sektor ortalamasinin uzerinde (genelde %5-10).' : absenceRate > 5 ? 'Uyari: Devamsizlik orani yuksek.");
  if (input.productivityLossPercent > 30) hiddenLossDrivers.push("Kritik: Verimlilik kaybi cok yuksek.' : productivityLossPercent > 15 ? 'Uyari: Verimlilik kaybi onemli.");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Sektor karsilastirmasi","Detayli rapor (breakdown grafikleri)"],
  };
}
