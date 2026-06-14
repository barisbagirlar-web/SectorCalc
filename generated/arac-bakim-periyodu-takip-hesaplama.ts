// Auto-generated from arac-bakim-periyodu-takip-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AracBakimPeriyoduTakipHesaplamaInput {
  equipmentType: 'genel' | 'kritik' | 'standart';
  manufacturerRecommendedInterval: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  environmentalFactor: number;
  maintenanceHistoryScore: number;
  criticalityFactor: number;
}

export const AracBakimPeriyoduTakipHesaplamaInputSchema = z.object({
  equipmentType: z.enum(['genel', 'kritik', 'standart']).default('genel'),
  manufacturerRecommendedInterval: z.number().min(1).max(3650).default(90),
  operatingHoursPerDay: z.number().min(0).max(24).default(8),
  operatingDaysPerYear: z.number().min(1).max(365).default(250),
  environmentalFactor: z.number().min(1).max(5).default(1),
  maintenanceHistoryScore: z.number().min(0).max(100).default(50),
  criticalityFactor: z.number().min(1).max(5).default(3),
});

export interface AracBakimPeriyoduTakipHesaplamaOutput {
  adjustedInterval: number;
  breakdown: {
    adjustedInterval: number;
    nextMaintenanceDate: number;
    maintenanceFrequencyPerYear: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AracBakimPeriyoduTakipHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.adjustedInterval = (() => { try { return input.manufacturerRecommendedInterval * (1 - (input.environmentalFactor - 1) * 0.1) * (1 - (100 - input.maintenanceHistoryScore) / 100 * 0.2) * (1 - (input.criticalityFactor - 1) * 0.05); } catch { return 0; } })();
  results.nextMaintenanceDate = (() => { try { return today + results.adjustedInterval; } catch { return 0; } })();
  results.maintenanceFrequencyPerYear = (() => { try { return input.operatingDaysPerYear / results.adjustedInterval; } catch { return 0; } })();
  return results;
}

export function calculateAracBakimPeriyoduTakipHesaplama(input: AracBakimPeriyoduTakipHesaplamaInput): AracBakimPeriyoduTakipHesaplamaOutput {
  const results = evaluateFormulas(input);
  const adjustedInterval = results.adjustedInterval ?? 0;
  const breakdown = {
    adjustedInterval: results.adjustedInterval,
    nextMaintenanceDate: results.nextMaintenanceDate,
    maintenanceFrequencyPerYear: results.maintenanceFrequencyPerYear,
  };

  // rule: manufacturerRecommendedInterval > 0
  // rule: operatingHoursPerDay >= 0 && operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear >= 1 && operatingDaysPerYear <= 365
  // rule: environmentalFactor >= 1 && environmentalFactor <= 5
  // rule: maintenanceHistoryScore >= 0 && maintenanceHistoryScore <= 100
  // rule: criticalityFactor >= 1 && criticalityFactor <= 5
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kritik: Bakim gecmisi cok dusuk, acil mudahale gerekebilir.
  // threshold skipped (non-JS): Uyari: Zorlu cevresel kosullar, bakim periyodu kisaltilmali.
  // threshold skipped (non-JS): Uyari: Yuksek kritiklik, daha sik bakim onerilir.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedInterval * (1 - (100 - input.maintenanceHistoryScore) / 100 * 0.1); } catch { return adjustedInterval; } })();

  return {
    adjustedInterval,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
