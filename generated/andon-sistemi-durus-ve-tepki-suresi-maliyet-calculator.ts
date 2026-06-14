// Auto-generated from andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInput {
  totalDowntimeMinutes: number;
  responseTimeMinutes: number;
  hourlyCost: number;
  productionRatePerHour: number;
  profitPerUnit: number;
  shiftHours: number;
  workingDaysPerYear: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputSchema = z.object({
  totalDowntimeMinutes: z.number().min(0).max(1440).default(60),
  responseTimeMinutes: z.number().min(0).max(60).default(5),
  hourlyCost: z.number().min(0).max(500).default(50),
  productionRatePerHour: z.number().min(0).max(10000).default(100),
  profitPerUnit: z.number().min(0).max(1000).default(10),
  shiftHours: z.number().min(1).max(24).default(8),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorOutput {
  totalCost: number;
  breakdown: {
    downtimeCost: number;
    opportunityCost: number;
    lostProduction: number;
    annualCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.downtimeCost = (() => { try { return input.totalDowntimeMinutes / 60 * input.hourlyCost; } catch { return 0; } })();
  results.lostProduction = (() => { try { return input.totalDowntimeMinutes / 60 * input.productionRatePerHour; } catch { return 0; } })();
  results.opportunityCost = (() => { try { return results.lostProduction * input.profitPerUnit; } catch { return 0; } })();
  results.totalCost = (() => { try { return results.downtimeCost + results.opportunityCost; } catch { return 0; } })();
  results.annualCost = (() => { try { return results.totalCost * (input.workingDaysPerYear / (input.shiftHours * 60 / input.totalDowntimeMinutes)); } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalCost * (input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9); } catch { return 0; } })();
  return results;
}

export function calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(input: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInput): AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    downtimeCost: results.downtimeCost,
    opportunityCost: results.opportunityCost,
    lostProduction: results.lostProduction,
    annualCost: results.annualCost,
  };

  // rule: totalDowntimeMinutes >= 0
  // rule: responseTimeMinutes >= 0
  // rule: hourlyCost > 0
  // rule: productionRatePerHour > 0
  // rule: profitPerUnit > 0
  // rule: shiftHours > 0
  // rule: workingDaysPerYear > 0
  // rule: responseTimeMinutes <= totalDowntimeMinutes
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Tepki suresi 10 dakikayi asiyor; iyilestirme onerilir.
  // threshold skipped (non-JS): Toplam durma suresi 1 saati asiyor; kritik kayip.
  // threshold skipped (non-JS): Iscilik maliyeti yuksek; verimlilik analizi onerilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

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
