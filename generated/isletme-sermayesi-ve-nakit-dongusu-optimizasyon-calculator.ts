// Auto-generated from isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInput {
  annualRevenue: number;
  costOfGoodsSold: number;
  averageInventory: number;
  averageAccountsReceivable: number;
  averageAccountsPayable: number;
  daysInPeriod: number;
  costOfCapital: number;
}

export const IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputSchema = z.object({
  annualRevenue: z.number().min(0).default(10000000),
  costOfGoodsSold: z.number().min(0).default(6000000),
  averageInventory: z.number().min(0).default(1000000),
  averageAccountsReceivable: z.number().min(0).default(1500000),
  averageAccountsPayable: z.number().min(0).default(800000),
  daysInPeriod: z.number().min(1).max(365).default(365),
  costOfCapital: z.number().min(0).max(100).default(10),
});

export interface IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorOutput {
  cashConversionCycle: number;
  breakdown: {
    inventoryDays: number;
    receivableDays: number;
    payableDays: number;
    workingCapital: number;
    annualWorkingCapitalCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.inventoryDays = ((): number => { try { const __v = input.averageInventory / (input.costOfGoodsSold / input.daysInPeriod); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.receivableDays = ((): number => { try { const __v = input.averageAccountsReceivable / (input.annualRevenue / input.daysInPeriod); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.payableDays = ((): number => { try { const __v = input.averageAccountsPayable / (input.costOfGoodsSold / input.daysInPeriod); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cashConversionCycle = ((): number => { try { const __v = results.inventoryDays + results.receivableDays - results.payableDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.workingCapital = ((): number => { try { const __v = input.averageInventory + input.averageAccountsReceivable - input.averageAccountsPayable; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.workingCapitalCost = ((): number => { try { const __v = results.workingCapital * (input.costOfCapital / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualWorkingCapitalCost = ((): number => { try { const __v = results.workingCapitalCost * (365 / input.daysInPeriod); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(input: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInput): IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const cashConversionCycle = results.cashConversionCycle ?? 0;
  const breakdown = {
    inventoryDays: results.inventoryDays,
    receivableDays: results.receivableDays,
    payableDays: results.payableDays,
    workingCapital: results.workingCapital,
    annualWorkingCapitalCost: results.annualWorkingCapitalCost,
  };

  // rule: annualRevenue > 0
  // rule: costOfGoodsSold > 0
  // rule: averageInventory >= 0
  // rule: averageAccountsReceivable >= 0
  // rule: averageAccountsPayable >= 0
  // rule: daysInPeriod between 1 and 365
  // rule: costOfCapital between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): cashConversionCycle
  // threshold skipped (non-string): inventoryDays
  // threshold skipped (non-string): receivableDays
  // threshold skipped (non-string): payableDays

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return cashConversionCycle; } })();

  return {
    cashConversionCycle,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis donem karsilastirmasi)","Sektor benchmark karsilastirmasi","Detayli rapor (breakdown ve oneriler)"],
  };
}
